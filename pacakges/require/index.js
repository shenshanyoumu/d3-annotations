const metas = new Map();
const queue = [];
const map = queue.map;
const some = queue.some;
const hasOwnProperty = queue.hasOwnProperty;
const origin = "https://unpkg.com/";
const identifierRe = /^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/;
const versionRe = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/;

function string(value) {
  return typeof value === "string" ? value : "";
}

// 在
function parseIdentifier(identifier) {
  const match = identifierRe.exec(identifier);
  return (
    match && {
      name: match[1],
      version: match[2],
      path: match[3]
    }
  );
}

// 找到模块的package.json文件，并抽取该文件的内容返回
function resolveMeta(target) {
  const url = `${origin}${target.name}${
    target.version ? `@${target.version}` : ""
  }/package.json`;
  let meta = metas.get(url);
  if (!meta)
    metas.set(
      url,
      (meta = fetch(url).then(response => {
        if (!response.ok) throw new Error("unable to load package.json");
        if (response.redirected && !metas.has(response.url))
          metas.set(response.url, meta);
        return response.json();
      }))
    );
  return meta;
}

// 在通过require方式加载模块时，需要传入模块的路径字符串
// 根据路径字符串加载模块的package.json文件内容，并提取其中依赖项和入口
async function resolve(name, base) {
  if (name.startsWith(origin)) {
    name = name.substring(origin.length);
  }
  if (/^(\w+:)|\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name))
    return new URL(name, base == null ? location : base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name))
    throw new Error("illegal name");

  // 在unpkg站点解析出模块路径
  const target = parseIdentifier(name);
  if (!target) return `${origin}${name}`;
  if (!target.version && base != null && base.startsWith(origin)) {
    const meta = await resolveMeta(
      parseIdentifier(base.substring(origin.length))
    );
    target.version =
      (meta.dependencies && meta.dependencies[target.name]) ||
      (meta.peerDependencies && meta.peerDependencies[target.name]);
  }
  if (target.path && target.version && versionRe.test(target.version))
    return `${origin}${target.name}@${target.version}/${target.path}`;
  const meta = await resolveMeta(target);
  return `${origin}${meta.name}@${meta.version}/${target.path ||
    string(meta.unpkg) ||
    string(meta.browser) ||
    string(meta.main) ||
    "index.js"}`;
}

//require关键字是AMD模块加载器的核心
export const require = requireFrom(resolve);

export function requireFrom(resolver) {
  const cache = new Map();
  const requireBase = requireRelative(null);

  function requireAbsolute(url) {
    if (typeof url !== "string") return url;
    let module = cache.get(url);
    if (!module)
      cache.set(
        url,
        (module = new Promise((resolve, reject) => {
          // AMD加载器的本质，就是在document创建一个script标签
          // 并设置script标签async属性，从而指导浏览器异步加载模块文件
          const script = document.createElement("script");
          script.onload = () => {
            try {
              resolve(queue.pop()(requireRelative(url)));
            } catch (error) {
              reject(new Error("invalid module"));
            }
            script.remove();
          };
          script.onerror = () => {
            reject(new Error("unable to load module"));
            script.remove();
          };
          script.async = true;
          script.src = url;

          // 将define函数挂载到window全局对象
          window.define = define;
          document.head.appendChild(script);
        }))
      );
    return module;
  }

  function requireRelative(base) {
    return name => Promise.resolve(resolver(name, base)).then(requireAbsolute);
  }

  function requireAlias(aliases) {
    return requireFrom((name, base) => {
      if (name in aliases) {
        (name = aliases[name]), (base = null);
        if (typeof name !== "string") return name;
      }
      return resolver(name, base);
    });
  }

  function require(name) {
    return arguments.length > 1
      ? Promise.all(map.call(arguments, requireBase)).then(merge)
      : requireBase(name);
  }

  require.alias = requireAlias;
  require.resolve = resolver;

  return require;
}

function merge(modules) {
  const o = {};
  for (const m of modules) {
    for (const k in m) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null)
          Object.defineProperty(o, k, {
            get: getter(m, k)
          });
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return () => object[name];
}

function isexports(name) {
  return name + "" === "exports";
}

/**
 *
 * @param {*} name 表示符合AMD规范的模块名称
 * @param {*} dependencies 该模块的依赖项
 * @param {*} factory 用于实现该模块的工厂方法
 */
function define(name, dependencies, factory) {
  const n = arguments.length;
  if (n < 2) (factory = name), (dependencies = []);
  else if (n < 3)
    (factory = dependencies),
      (dependencies = typeof name === "string" ? [] : name);
  queue.push(
    some.call(dependencies, isexports)
      ? require => {
          const exports = {};
          return Promise.all(
            map.call(dependencies, name => {
              return isexports((name += "")) ? exports : require(name);
            })
          ).then(dependencies => {
            factory.apply(null, dependencies);
            return exports;
          });
        }
      : require => {
          // 只有模块所有依赖项都加载完备，该模块才会被加载。不然会导致错误
          return Promise.all(map.call(dependencies, require)).then(
            dependencies => {
              return typeof factory === "function"
                ? factory.apply(null, dependencies)
                : factory;
            }
          );
        }
  );
}

define.amd = {};
