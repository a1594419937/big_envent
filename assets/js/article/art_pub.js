$(function () {
    initCate()
    initEditor()
    let form = layui.form
    let layer = layui.layer
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/cate/list",
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取失败')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        });
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 给input - flie添加点击事件
    $('.btn-choose').on('click', function () {
        $('#file').click()
    })
    $('#file').on('change', function (e) {
        var file = e.target.files[0]
        if (file.length === 0) {
            return layer.msg('请选择图片')
        }
        var newImgURL = URL.createObjectURL(file)
        $image.cropper('destroy')// 销毁旧的裁剪区域   
            .attr('src', newImgURL) // 重新设置图片路径  
            .cropper(options) // 重新初始化裁剪区域
    })

    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                publishAnArticle(fd)
            })


    });
    // 定义发送发布文件AJAX
    function publishAnArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // post 提交FORMDATA数据必须设置下面两个变量
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
            }

        });
        $('#form_pub')[0].reset()
    }
})