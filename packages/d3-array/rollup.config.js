import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

const config = {
  input: "src/index.js",
  /** 引用其他D3模块 */
  external: Object.keys(meta.dependencies || {}).filter(key => /^d3-/.test(key)),
  output: {
    file: `dist/${meta.name}.js`,
    name: "d3",
    format: "umd",
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`,
    
    /** 将模块package.json文件中依赖的其他D3模块全局挂载 */
    globals: Object.assign(
      {}, 
      ...Object.keys(meta.dependencies || {})
      .filter(key => /^d3-/.test(key))
      .map(key => ({[key]: "d3"})))
  },

  //rollup插件，webpack的插件用于处理依赖树
  plugins: []
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];
