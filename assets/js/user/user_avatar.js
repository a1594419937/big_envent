$(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 为上传点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 获取用户选择的文件
    // 绑定change事件 文件选择
    $('#file').on('change', function (e) {
        let filelist = e.target.files
        /* console.log(filelist);
        console.log(e); */
        if (filelist.length === 0) {
            return layer.msg('请选择图片')
        }
        // 拿到用户选择的文件
        let file = filelist[0]
        // 将文件化为路径
        var newImgURL = URL.createObjectURL(file)
        // 初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    $('#btnUpload').on('click', function () {
        // 拿到用户裁剪的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 上传服务器
        $.ajax({
            type: "PATCH",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('更换图片失败')
                }
                layer.msg('更换图片成功')
                window.parent.getuserInfo()
            }
        });
    })
})