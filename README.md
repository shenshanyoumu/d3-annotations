# d3-annotations

&ensp;&ensp;该项目针对 D3 的源码中一些比较难懂的部分进行注解，方便大家深入理解 D3 的实现原理。由于个人水平有限，对其中有错误理解的部分欢迎 PR。

# d3.js 简介

&ensp;&ensp;D3，即 Data-Driven Documents。开发者关注数据本身，而对 DOM 的操作都由 D3 完成。不过目前前端可视化的做法一般是利用 D3 的数据操作模型进行数据转换，而真实 DOM 操作交给第三方 UI 库比如 React 进行。

# d3.js 设计哲学

&ensp;&ensp;D3 的实现深刻理解了 Grammar of Graphics 的精髓，即错综复杂的各类图表可以抽象为一些基础组件和运算过程，而 D3 就是实现了这些基础组件和运算过程，为开发者提供了最大的灵活性和自由度。

# D3 核心概念

（1）选择器  
&ensp;&ensp;D3 封装了一组选择器函数，用于绑定数据和 DOM 节点。  
（2）动态属性  
&ensp;&ensp;D3 被称为数据领域的 jQuery；D3 底层基于 SVG 渲染，而上层 API 与底层 SVG 的 API 进行了映射。并且对于 DOM 节点的属性设置支持动态绑定  
（3）Enter/Exit  
&ensp;&ensp;D3 需要开发者手动对数据集和 DOM 节点集进行 Enter/Exit 处理，来动态增加和删除 DOM 节点。  
（4）transformation & transition  
&ensp;&ensp;D3 完全基于 HTML+CSS+JS+SVG，因此完全基于前端开发的动画/渐变实现。为了方便开发者，D3 的动画/渐变本质上就是对底层的前端动画/渐变的封装

# D3 主要模块简介

&ensp;&ensp;D3 代码库基于 lerna 工具生成多包单体仓库，而每个模块的打包采用 rollup 打包器，其主要模块包括  
（1）Arrays(难度系数:3.5,重要性系数:4.5)  
&ensp;&ensp;D3 中所有数据源都是数组形式，定义了一系列数组的运算函数

（2）Axis  
&ensp;&ensp;坐标轴是对内生比例尺的外化，即坐标轴方便人类理解而真正参与图形运算的其实是 scale 比例尺。D3 在处理坐标轴的刻度值方面进行了完备的算法实现，可以很友好地在比例尺缩放操作中美化刻度显示

（3）Brush(难度系数:3.5,重要性系数:4)  
&ensp;&ensp;刷子的作用是在可视图表中选取一个区域，用于后续的缩放操作

（4）Chord  
&ensp;&ensp;D3 的实现哲学中并不会针对每种图表进行设计，而是对一类图表抽取共性的东西，并称之为 layout。布局就是 D3 在连接数据和图表实例的桥梁，开发者最主要的工作就是将数据转换为对应图表的 layout

（5）collections(难度系数:4,重要性系数:4.5)  
&ensp;&ensp;D3 中除了数组形式的数据结构，还有一类具有 keys 值的层次结构对象，比如 Maps、Sets、Nests 等。针对这些基本的数据结构实现了整套的功能

（6）Colors(难度系数:3.5,重要性系数:3)  
&ensp;&ensp;颜色系统非常丰富，事实上颜色的显示和转换等具备庞杂的知识体系。D3 专门有几个模块用于处理颜色相关内容，包括颜色格式、颜色的计算等

（7）Color Schemes(难度系数:3.5,重要性系数:3)  
&ensp;&ensp;D3 对各种颜色系统采用调色盘形式封装，主要包括 categorical 形式的颜色、各种插值算法实现的颜色系统

（8）Contours-等高线  
&ensp;&ensp;在地图可视化中计算等高多边形是基本要求

（9）dispatch(难度系数:3,重要性系数:3)  
&ensp;&ensp;D3 实现了一套事件发布/订阅机制，用于分离事件和回调函数的耦合

（10）Dragging(难度系数:3.5,重要性系数:4.5)  
&ensp;&ensp;在 SVG、HTML 和 Canvas 上实现拖拽行为

（11）Delimiter-Separated Values  
&ensp;&ensp;对外部包含分隔符的文件进行处理，得到图表所需的数据源

（12）Easings(难度系数:3.5,重要性系数:4)  
&ensp;&ensp;虽然 D3 的动画都是基于 HTML+CSS+JS，但是动画的具体形式需要 D3 来实现，这就是该模块的意义

（13）Fetch(难度系数:3,重要性系数:3)  
&ensp;&ensp;D3 的数据源大部分来自网络，因此定义 Fetch 模块实现网络请求

（14）Forces  
&ensp;&ensp;基于速度的 Verlet 积分实现的力导向图，这种布局算法在模拟具有强度信息的关系网很有效

（15）Number Formats(难度系数:4.5,重要性系数:3)  
&ensp;&ensp;对一些数据格式进行转换，以方便人类理解

（16）Geographies  
&ensp;&ensp;有关地图投影、地图形态和相关数学运算的模块。大量涉及球面、曲面运算

（17）Hierarchies  
&ensp;&ensp;对具有层次结构图表的一种布局算法，现实中 Tree 图、TreeMap、Packing 图等都可以使用这种布局变种

（18）Interpolators(难度系数:4.5,重要性系数:4)  
&ensp;&ensp;插值器用于对数组、颜色、字符串、数组、对象等任何具有离散的结构进行差值

（19）Paths(难度系数:2,重要性系数:4.5)  
&ensp;&ensp;D3 的 Paths 模块定义的 API 与 SVG 的 API 几乎一一对应，方便开发者使用 JS 来实现之前 SVG 上复杂的路径渲染

（20）Polygons(难度系数:3,重要性系数:4.5)  
&ensp;&ensp;对于二维多边形的各种几何运算，包括求面积、周长和计算凸包等

（21）Quadtrees(难度系数:3.5,重要性系数:3)  
&ensp;&ensp;对二维几何空间进行递归划分的模块

（22）Random Numbers(难度系数:3.5,重要性系数:3)  
&ensp;&ensp;生成符合特定数学分布的随机数数组

（23）Scales  
&ensp;&ensp;比例尺的作用就是将抽象的数据映射为人类可以理解的图表的关键工具。比例尺分为线性、非线性、序列、发散比例尺、量化比例尺等

（24）Selections(难度系数:4,重要性系数:4.5)  
&ensp;&ensp;这是 D3 用于绑定 DOM 结构和数据集的工具模块，D3 的数据驱动思想就是通过 Selection 实现，选择器根据数据绑定 DOM，并可对 DOM 节点进行属性修改和事件处理

（25）Shapes(难度系数:4.5,重要性系数:4.5)  
&ensp;&ensp;该模块定义了一系列基础图元，包含弧线、曲线、饼图、封闭图、线段、基于贝塞尔曲线实现的 Links 线、Symbols、堆栈图等

（26）Time Format(难度系数:4,重要性系数:3.5)  
&ensp;&ensp;受到 C 语言 strptime 和 strftime 函数的启发，实现的时间格式模块

（27）Time Intervals  
&ensp;&ensp;将独立的时刻转化为人类能感知的时间变化，包括时分秒和星期年月等

（28）Timers(难度系数:3.5,重要性系数:4.5)  
&ensp;&ensp;用于处理并发动画的高效计时队列

（29）Transitions(难度系数:4,重要性系数:4.5)  
&ensp;&ensp;对选择的 DOM 集进行渐变动画的模块

（30）Voronoi Diagram(难度系数:4.5,重要性系数:3)  
&ensp;&ensp;针对给定的点计算维诺图，这是一种复杂的图表结构

（31）Zooming(难度系数:4,重要性系数:4.5)  
&ensp;&ensp;对 SVG 图表、HTML 图表或者 canvas 图表进行平移/缩放操作

# 项目组织结构

由于 D3 源码按照模块进行组织，导致在注解时可能非常分散。因此本项目采用 lerna 方式进行 multi-packages 的单体仓库。
