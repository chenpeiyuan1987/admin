layui.config({
    version: true,
}).extend({
    mock: '{/}/js/mock',
    kit: '{/}/js/modules/kit'
}).use(['jquery', 'table', 'form', 'mock', 'log', 'layer', 'kit'], function($, table, form, mock, log, layer, kit) {
    // 实例表格
    var inst = table.render({
        url: '/data/user/list',
        elem: '#table',
        page: true,
        toolbar: '#toolbarTpl1',
        defaultToolbar: [],
        cols: [[
            {type: 'checkbox', width: 80},
            {type: 'numbers', title: '序号', width: 80},
            {field: 'username', title: '用户名'},
            {field: 'roleName', title: '角色名'},
            {field: 'createTime', title: '创建时间'},
            {title: '用户操作', toolbar: '#toolbarTpl2'},
        ]],
    });

    // 点击事件
    var events = {
        
        /**
         * 添加
         */
        insert: function(data) {
            layer.open({
                type: 2,
                title: '添加用户',
                content: '/html/user/edit.html',
                area: ['500px', '300px'],
                btn: ['确定', '取消'],
                yes: function(index, $elem) {
                    var $iframe = $elem.find('iframe'),
                        $submit = $iframe.contents().find('#submit'),
                        iwin = $iframe[0].contentWindow;

                    iwin.layui.form.on('submit(submit)', function(data) {
                        kit.req({
                            url: '/data/user/save',
                            data: data.field,
                            done: function(data) {
                                table.reload('table');
                                layer.close(index);
                            },
                        });
                    });

                    $submit.trigger('click');
                }
            });
        },

        /**
         * 编辑
         */
        update: function(data) {
            var id = data.data.id;

            layer.open({
                type: 2,
                title: '编辑用户',
                content: '/html/user/edit.html?id=' + id,
                area: ['500px', '300px'],
                btn: ['确定', '取消'],
                yes: function(index, $elem) {
                    var $iframe = $elem.find('iframe'),
                        $submit = $iframe.contents().find('#submit')
                        iwin = $iframe[0].contentWindow;

                    iwin.layui.form.on('submit(submit)', function(data) {
                        kit.req({
                            url: '/data/user/save',
                            data: data.field,
                            done: function(data) {
                                table.reload('table');
                                layer.close(index);
                            },
                        });
                    });

                    $submit.trigger('click');
                }
            });
        },

        /**
         * 删除
         */
        delete: function(data) {
            var list = data.config 
                ? table.checkStatus(data.config.id).data 
                : [data.data];
            log.trace('delete', list);

            if(list.length <= 0) {
                return layer.msg('请选择数据');
            }

            layer.confirm('确定删除吗？', function(index) {
                kit.req({
                    url: '/data/user/del',
                    data: data.field,
                    done: function(data) {
                        table.reload('table');
                        layer.close(index);
                    },
                });
            });            
        }
    };

    // 监听搜索
    form.on('submit(search)', function(data) {
        table.reload('table', {
            where: data.field
        });
    });

    // 监听工具
    table.on('toolbar(table)', function(data) {
        events[data.event] && events[data.event](data);
    });
    table.on('tool(table)', function(data) {
        events[data.event] && events[data.event](data);
    });

});