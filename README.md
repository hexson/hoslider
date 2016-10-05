# Hoslider

touch slider for mobile

一个简单易用的 **mobile** 端 touch slider 组件类库,目前正在持续更新中...

## example

首先引入

`<link rel="stylesheet" type="text/css" href="/build/hoslider.css">`

`<script type="text/javascript" src="/build/hoslider.min.js"></script>`

栗子很简单

`
var demo = new Hoslider('demo', {
	partition: 15
});
`

现在你就可以在手机浏览器或者 **chrome** 浏览器里面模拟mobile查看效果

## 参数

**partition**

组件间隔(单位:px)

`partition: 10`

**duration**

动画执行时间(单位:ms)

`duration: 300`

**touchEndCallback**

touch 事件结束回调函数

`
touchEndCallback: function () {
	// some code...
}
`

**endCallback**

touch 事件最后结束回调函数

`
endCallback: function () {
	// some code...
}
`