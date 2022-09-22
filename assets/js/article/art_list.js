$(function () {
    // 定义四个参数对象，方便请求参数
    // 定义美化时间的过滤器
    let form = layui.form
    let laypage = layui.laypage
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    let p = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    let layer = layui.layer
    // 获取文章数据
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: p,
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页
                renderPage(res.total)
            }
        })
    }
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

    // form-search 绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        p.cate_id = cate_id
        p.state = state
        initTable()
    })


    // 定义分页方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total //数据总数，从服务端得到
            , limit: p.pagesize //每页显示的条数
            , limits: [2, 4, 6, 8, 10] //每页条数的选择项
            , curr: p.pagenum //默认选择的页数
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            // 当分页被切换时触发
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                p.pagenum = obj.curr       //赋值最新的值赋给p
                p.pagesize = obj.limit    //赋值最新的条数
                //  根据最新的数据来进行渲染表格
                // initTable()
                // 通过first 值来判断  第一次是true  其他未unfiednd  第一次不调用 initTable()
                if (first !== true) {
                    initTable()
                }
            }


        });

    }


    // 删除文件
    $('tbody').on('click', '.btn-delete', function () {
        let les = $('.btn-delete').length
        let id = $(this)[0].dataset.id
        layer.confirm('确认删除吗？', { icon: 3, title: '是否删除' }, function (index) {
            //do something
            $.ajax({
                type: "DELETE",
                url: "/my/article/info?id=" + id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 页面没有数据了 les=1删除完该页面没有数据了
                    if (les === 1) {
                        // 使用三元表达式进行，页吗值最小必须是1
                        p.pagenum = p.pagenum === 1 ? 1 : p.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index);
        });
    })
})