$(function () {
    // 获取用户信息

    getuserInfo()
})
function getuserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户失败')
            }
            // 渲染用户的头像
            renderAvatar(res.data)
            let layer = layui.layer
        },
       
    });

    function renderAvatar(user) {
        // 1.获取名字
        let name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 按需求渲染用户头像
        if (user.user_pic !== null) {
            $('.layui-nav-img')
                .attr('src', user.user_pic)
                .show()
            $('.text-avatar').hide()
        } else {
            $('.layui-nav-img').hide()
            let first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
    // 退出
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.清除token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href = 'http://localhost:8080/05-%E6%A1%88%E4%BE%8B/login.html'
            layer.close(index);
        });

    })
}