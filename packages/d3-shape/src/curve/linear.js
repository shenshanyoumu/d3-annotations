/**
 * context表示画布上下文，比如canvas或者SVG
 * @param {*} context 
 */
function Linear(context) {
  this._context = context;
}

/** 线性图元generator，所谓线性图元即直线、直边区域等 */
Linear.prototype = {
  /** 
   * 图表中区域由一系列线段构成。_line为0表示绘制线段开始标记
   * _line为NaN表示绘制线段结束标记
   */
  areaStart: function() {
    this._line = 0;
  },

  // NaN与任何值都不相等，可以准确表示绘制区域动作结束
  areaEnd: function() {
    this._line = NaN;
  },
  /**
   * 线段由一系列点构成，_point为0表示线段开始绘制的指示
   */
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    // closePath形成封闭图元。注意if(NaN)为false
    if (this._line || (this._line !== 0 && this._point === 1))
       this._context.closePath();

    this._line = 1 - this._line;
  },
  point: function(x, y) {
    // 将参数(x,y)数值化处理
    x = +x, y = +y;
    switch (this._point) {
      // point的四种状态，来指示画布对象的线段图元绘制过程
      case 0: this._point = 1; 
        this._line ? this._context.lineTo(x, y) : 
        this._context.moveTo(x, y); break;

      case 1: this._point = 2; 

      // 当point状态2或者1，都会进行线段绘制过程
      default: this._context.lineTo(x, y); break;
    }
  }
};

// context表示画布对象，用于将generator输出到视觉呈现
// context一般为d3-path，d3-path屏蔽了具体的SVG绘制命令
export default function(context) {
  return new Linear(context);
}
