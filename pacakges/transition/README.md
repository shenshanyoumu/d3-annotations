# d3-transition

&ensp;&ensp;该模块用于图表元素的渐变动画。transition 模块的实现类似 d3-selection，即针对选择集进行渐变动画处理，因此该模块与 d3-selection 实际上有代码冗余。注意渐变的主体包括颜色相关、位置/属性值相关，并且当图表存在多个渐变动画时需要使用 d3-timer 来控制同步；
