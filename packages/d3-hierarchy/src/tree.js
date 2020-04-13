import {Node} from "./hierarchy/index.js";


// separation函数用于分离 具有neighboring关系的叶子节点。
// 注意neighboring关系的叶子节点可能是兄弟节点，也可能是远方亲戚节点
// 下面用于标记布局器中两个相邻节点的"血缘"关系
function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
}


// 如果存在孩子节点则返回最左边孩子，否则返回节点v的线索化前驱节点
// 注意针对树的中序、后序和先序遍历，其节点v的前驱节点是不一样的
function nextLeft(v) {
  var children = v.children;
  return children ? children[0] : v.t;
}

// 同理得到节点的最右边孩子节点，或者后继节点
function nextRight(v) {
  var children = v.children;
  return children ? children[children.length - 1] : v.t;
}

// Shifts the current subtree rooted at w+. This is done by increasing
// prelim(w+) and mod(w+) by shift.

// wp.i表示节点wp在所有兄弟节点中的索引;wm表示节点wm在所有兄弟节点中的索引
function moveSubtree(wm, wp, shift) {

  // 
  var change = shift / (wp.i - wm.i);
  wp.c -= change;
  wp.s += shift;
  wm.c += change;
  wp.z += shift;
  wp.m += shift;
}

// All other shifts, applied to the smaller subtrees between w- and w+, are
// performed by this function. To prepare the shifts, we have to adjust
// change(w+), shift(w+), and change(w-).
function executeShifts(v) {
  var shift = 0,
      change = 0,
      children = v.children,
      i = children.length,
      w;
  while (--i >= 0) {
    w = children[i];
    w.z += shift;
    w.m += shift;
    shift += w.s + (change += w.c);
  }
}

// 如果vim节点的某个祖先节点与v节点是兄弟节点，则返回vim的该祖先节点
// 否则返回默认的祖先节点
function nextAncestor(vim, v, ancestor) {
  return vim.a.parent === v.parent ? vim.a : ancestor;
}

// 树节点对象,下面参数的含义呢？
function TreeNode(node, i) {
  this._ = node; //存放层级结构中的一个节点，该节点包含depth、height、parent、children和data等属性
  this.parent = null; //节点的父节点和孩子节点
  this.children = null;
  this.A = null; // default ancestor 默认祖先节点
  this.a = this; // ancestor 某个祖先节点
  this.z = 0; // prelim。在处理tree布局时，用于节点在画布中绘制坐标的确认参数
  this.m = 0; // mod，表示节点发生偏移后，相对于原本位置的偏移量。即modified

  this.c = 0; // change .c和.s也是精细化控制节点的布局位置的参数
  this.s = 0; // shift 
  
  this.t = null; // 二叉树的线索化
  this.i = i; // 表示在兄弟节点中的索引。根节点i为0
}

TreeNode.prototype = Object.create(Node.prototype);

function treeRoot(root) {
  var tree = new TreeNode(root, 0),
      node,
      nodes = [tree],
      child,
      children,
      i,
      n;

  // 逐层级将树形结构上节点保存到nodes数组，并为孩子节点新增parent指针
  while (node = nodes.pop()) {
    if (children = node._.children) {
      node.children = new Array(n = children.length);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new TreeNode(children[i], i));
        child.parent = node;
      }
    }
  }

  // root节点的parent为null，孩子节点即root本身
  (tree.parent = new TreeNode(null, 0)).children = [tree];
  return tree;
}

// Node-link tree diagram using the Reingold-Tilford "tidy" algorithm
export default function() {
  var separation = defaultSeparation,
      dx = 1,
      dy = 1,
      nodeSize = null;

  function tree(root) {
    // 构建具有children/parent双向指针的树
    var t = treeRoot(root);

    // Compute the layout using Buchheim et al.’s algorithm.
    t.eachAfter(firstWalk), t.parent.m = -t.z;
    t.eachBefore(secondWalk);

    // If a fixed node size is specified, scale x and y.
    if (nodeSize) root.eachBefore(sizeNode);

    // If a fixed tree size is specified, scale x and y based on the extent.
    // Compute the left-most, right-most, and depth-most nodes for extents.
    else {
      var left = root,
          right = root,
          bottom = root;
      root.eachBefore(function(node) {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
        if (node.depth > bottom.depth) bottom = node;
      });
      var s = left === right ? 1 : separation(left, right) / 2,
          tx = s - left.x,
          kx = dx / (right.x + s + tx),
          ky = dy / (bottom.depth || 1);
      root.eachBefore(function(node) {
        node.x = (node.x + tx) * kx;
        node.y = node.depth * ky;
      });
    }

    return root;
  }

  // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
  // applied recursively to the children of v, as well as the function
  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
  // node v is placed to the midpoint of its outermost children.

  // 为了初步计算节点v的X轴坐标分量，需要先遍历其孩子节点，根据孩子节点的位置来设置v的X轴坐标分量
  // tree默认是垂直布局，设置x轴分量后节点v
  function firstWalk(v) {
    // 当前节点v的孩子节点和兄弟节点(包括自己)
    var children = v.children,
        siblings = v.parent.children,

        // 如果当前节点v在所有兄弟节点中不是拍第一位，则返回其前面的兄弟节点w
        w = v.i ? siblings[v.i - 1] : null;
    
    // 
    if (children) {
      executeShifts(v);

      // 通过两个端点孩子节点的z参数来确定当前v节点的z定位，tree布局器通过z来确定节点v的坐标点
      var midpoint = (children[0].z + children[children.length - 1].z) / 2;

      // 如果当前节点v前面存在兄弟节点，则通过自定义的separation函数来重新调整v.z的值
      // 这个主要用于在图表绘制时，确定两个节点的间距
      if (w) {
        v.z = w.z + separation(v._, w._);

        // v.m表示节点v的新位置与原本位置之间的修改量
        v.m = v.z - midpoint;
      } else {

        // 如果节点v不存在兄弟节点，或者节点v是兄弟节点中第一个，则直接设置z值
        // 表示在图表绘制中，节点v的坐标只受到孩子节点布局影响
        v.z = midpoint;
      }
    } else if (w) {

      // 如果节点v没有孩子节点，且前面存在兄弟节点，则通过调整与前面兄弟节点的z参数来实现
      // 节点v的绘制坐标定位
      v.z = w.z + separation(v._, w._);
    }

    // 
    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
  }

  // 通过节点v的父节点坐标偏移量m，以及节点v本身相对孩子节点的布局定位z参数
  // 计算得到v节点在最终布局中x坐标分量，以及v的坐标偏移量m
  // 本质上，即父节点发生的坐标偏移，则子节点应该一起移动。不然画布link存在扭曲
  function secondWalk(v) {
    v._.x = v.z + v.parent.m;
    v.m += v.parent.m;
  }

  // The core of the algorithm. Here, a new subtree is combined with the
  // previous subtrees. Threads are used to traverse the inside and outside
  // contours of the left and right subtree up to the highest common level. The
  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
  // superscript o means outside and i means inside, the subscript - means left
  // subtree and + means right subtree. For summing up the modifiers along the
  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
  // nodes of the inside contours conflict, we compute the left one of the
  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
  // Finally, we add a new thread (if necessary).
  function apportion(v, w, ancestor) {
    if (w) {
      var vip = v,
          vop = v,
          vim = w,
          vom = vip.parent.children[0],
          sip = vip.m,
          sop = vop.m,
          sim = vim.m,
          som = vom.m,
          shift;
      while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
        vom = nextLeft(vom);
        vop = nextRight(vop);
        vop.a = v;
        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
        if (shift > 0) {
          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
          sip += shift;
          sop += shift;
        }
        sim += vim.m;
        sip += vip.m;
        som += vom.m;
        sop += vop.m;
      }
      if (vim && !nextRight(vop)) {
        vop.t = vim;
        vop.m += sim - sop;
      }
      if (vip && !nextLeft(vom)) {
        vom.t = vip;
        vom.m += sip - som;
        ancestor = v;
      }
    }
    return ancestor;
  }

  // 垂直绘制的一棵树中节点的坐标计算。
  function sizeNode(node) {
    node.x *= dx;
    node.y = node.depth * dy;
  }

  tree.separation = function(x) {
    return arguments.length ? (separation = x, tree) : separation;
  };

  // tree的布局尺寸，是在绘制时tree占据的空间范围
  tree.size = function(x) {
    return arguments.length ? (nodeSize = false,
       dx = +x[0], dy = +x[1], tree) : (nodeSize ? null : [dx, dy]);
  };

  // 
  tree.nodeSize = function(x) {
    return arguments.length ? (nodeSize = true,
       dx = +x[0], dy = +x[1], tree) : (nodeSize ? [dx, dy] : null);
  };

  return tree;
}
