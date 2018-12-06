import { range } from "d3-array";

// 需要区分瓦片数据和GEOJSON数据渲染地图的差异
export default function() {
  var x0 = 0,
    y0 = 0,
    x1 = 960, //DOM容器默认宽度
    y1 = 500, //DOM容器默认高度
    tx = (x0 + x1) / 2, //DOM容器中心点坐标
    ty = (y0 + y1) / 2,
    tileSize = 256, //瓦片默认尺寸
    scale = 256,
    zoomDelta = 0, //缩放增量
    wrap = true; //表示瓦片图在DOM容器平铺，可能出现周期性显示行为

  function tile() {
    // 瓦片图在每次缩放时，其图片尺寸比例变换
    // Math.log表示自然对数
    var log2tileSize = Math.log(tileSize) / Math.log(2),
      z = Math.max(Math.log(scale) / Math.LN2 - log2tileSize, 0),
      z0 = Math.round(z + zoomDelta),
      j = 1 << z0,
      k = Math.pow(2, z - z0 + log2tileSize),
      x = tx - scale / 2,
      y = ty - scale / 2,
      tiles = [],
      cols = range(
        Math.max(wrap ? -Infinity : 0, Math.floor((x0 - x) / k)),
        Math.min(Math.ceil((x1 - x) / k), wrap ? Infinity : j)
      ),
      rows = range(
        Math.max(0, Math.floor((y0 - y) / k)),
        Math.min(Math.ceil((y1 - y) / k), j)
      );

    // 缩放区域会形成一系列栅格，需要对每个栅格填充一个瓦片
    rows.forEach(function(y) {
      cols.forEach(function(x) {
        tiles.push({
          x: ((x % j) + j) % j,
          y: y,
          z: z0, //Z表示缩放等级
          tx: x * tileSize,
          ty: y * tileSize
        });
      });
    });

    // 瓦片的平移和缩放
    tiles.translate = [x / k, y / k];
    tiles.scale = k;
    return tiles;
  }

  tile.size = function(_) {
    return arguments.length
      ? ((x0 = y0 = 0), (x1 = +_[0]), (y1 = +_[1]), tile)
      : [x1 - x0, y1 - y0];
  };

  tile.extent = function(_) {
    return arguments.length
      ? ((x0 = +_[0][0]),
        (y0 = +_[0][1]),
        (x1 = +_[1][0]),
        (y1 = +_[1][1]),
        tile)
      : [[x0, y0], [x1, y1]];
  };

  tile.scale = function(_) {
    return arguments.length ? ((scale = +_), tile) : scale;
  };

  tile.translate = function(_) {
    return arguments.length ? ((tx = +_[0]), (ty = +_[1]), tile) : [tx, ty];
  };

  tile.zoomDelta = function(_) {
    return arguments.length ? ((zoomDelta = +_), tile) : zoomDelta;
  };

  // 如果设置了wrap参数，则瓦片会周期性展开，类似地图在X轴向的周期性布局
  tile.wrap = function(_) {
    return arguments.length ? ((wrap = _), tile) : wrap;
  };

  tile.tileSize = function(_) {
    return arguments.length ? ((tileSize = _), tile) : tileSize;
  };

  return tile;
}
