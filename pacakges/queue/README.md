# d3-queue

&ensp;&ensp;根据配置来并发执行异步任务，开发者可以控制同时执行的任务数。当所有任务执行完毕或者出现错误，该 queue 队列将结果传递给 await 回调。该模块类似 Async.js 的 parallel。

为了同步执行多个任务，需要创建一个 queue 实例，然后注册一个 await 回调即可  
<code>  
var q = d3.queue();  
q.defer(delayedHello);  
q.defer(delayedHello);  
q.await(function(error) {  
 if (error) throw error;  
 console.log("Goodbye!");  
});  
</code>
