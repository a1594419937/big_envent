$(function () {
    // 初始化文章数据
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/cate/list",
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });

    })
    // 通过代理的方式表单提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/cate/add",
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('提交文章分类失败' + res.message)
                }
                initArtCateList()
                layer.msg('提交文章分类成功')
                layer.close(indexAdd)
            }
        });
    })
    // 通过代理的方式修改事件
    let indexEdit = null
    $('body').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-eidt').html()
        })
        let ids = $(this).parent().siblings().eq(0).text()
        let name = $(this).parent().siblings().eq(1).text()
        let alias = $(this).parent().siblings().eq(2).text()
        let resDate = { id: ids, cate_name: name, cate_alias: alias }
        form.val("form-eidt", resDate)
    })
    // 通过代理来绑定修改分类提交事件
    $('body').on('submit', '#form-eidt', function (e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: "/my/cate/info",
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList()
            }
        });
    })
    $('tbody').on('click', '#btn-delete', function (e) {
        let id = $(this)[0].dataset.id
        // console.log(id);
        //    提示是否删除
        layer.confirm('是否删除?', { icon: 3, title: '删除分类' }, function (index) {
            $.ajax({
                type: "DELETE",
                url: "/my/cate/del/?id=" + id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                }
            });

            layer.close(index);
        });
    })
})
