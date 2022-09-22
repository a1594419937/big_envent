// 拼接url  
// 当调用ajax是会先调用 该方法
$.ajaxPrefilter(function (options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // http://www.liulongbin.top:3008/my/userinfo
    options.url = 'http://www.liulongbin.top:3008' + options.url
    // 设置同一请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function (res) {
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清除token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href = 'http://localhost:80/05-%E6%A1%88%E4%BE%8B/login.html'
        }
    }
})