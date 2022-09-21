$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $(".login-box").hide()
        $('.reg-box').show()
    })
    // 点击去注册的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $(".login-box").show()
    })
    // 从layui中获取对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify()
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码6到12位'],
        repwd: function (value) {
            let pwdone = $('.reg-box [name=password]').val()
            if (value !== pwdone) {
                return '两次密码不一样'
            }
        }
    })
    // 注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        let data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        console.log(data)
        $.post("/api/reguser", data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            console.log(res)
            $('#link_login').click()
        })
    })


    $('#form-login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                localStorage.setItem('token', res.token)
                layer.msg(res.message)
                console.log(res.token)
                location.href = '/E:/Html/node/05-%E6%A1%88%E4%BE%8B/index.html'
            }
        });
    })
})