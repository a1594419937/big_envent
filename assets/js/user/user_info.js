$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value,item) {
            if (value.length > 6) {
                return '昵称必须在1~6个之间'
            }
        }
    })
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 重置按钮
    $('#btnResult').on('click', function (e) {
        //   阻止默认重置
        e.preventDefault()
        initUserInfo()
    })
    // 发起提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('跟新成功')
                console.log(res)
                // 更新名称
                window.parent.getuserInfo()
            }
        })
    })
})