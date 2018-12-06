# d3-dispatch

&ensp;&ensp;D3 实现了对图表事件的分发/订阅系统，dispatch 是一种设计思维，可以有效隔离关注点和解耦代码。D3-request 模块也基于该机制来进行网络请求并通知图表更新。dispatch 的实现类似 Node 的 EventEmitter 机制
