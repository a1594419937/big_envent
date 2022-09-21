// 拼接url  
// 当调用ajax是会先调用 该方法
$.ajaxprefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url

})