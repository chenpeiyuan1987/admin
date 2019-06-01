layui.extend({
    mockjax: '{/}/lib/jquery.mockjax',
    log: '{/}/js/modules/log',
}).define(['log', 'mockjax'], function(exports) {
    var mockjax = layui.mockjax;
    var log = layui.log;

    mockjax({
        url: '/data/user/list',
        response: function(req) {
            log.trace(arguments);

            var list = [];
            var page = req.data.page;
            var offset = (page - 1) * 10 + 1 ;
            for(var i=offset; i<offset + 10; i++) {
                list.push({
                    id: i,
                    username: req.data.username || '用户' + i,
                    createTime: '2019-05-30 10:50:00',
                    roleName: '开发',
                });
            }
            this.responseText = {
                msg: '',
                code: 0,
                data: list,
                count: 100,
            };
        }
    });

    mockjax({
        url: '/data/user/info',
        response: function(req) {
            log.trace(arguments);

            var id = req.data.id;
            this.responseText = {
                info: '',
                code: 0,
                data: {
                    id: id,
                    username: '用户' + id,
                    roleName: '开发',
                    createTime: '2019-05-30 10:50:00',
                },
            };
        }
    });

    mockjax({
        url: '/data/user/save',
        response: function(req) {
            log.trace(arguments);

            this.responseText = {
                info: '',
                code: 0,
            };
        }
    });

    mockjax({
        url: '/data/user/del',
        response: function(req) {
            log.trace(arguments);

            this.responseText = {
                info: '',
                code: -10,
            };
        }
    });

    mockjax({
        url: '/data/project/list',
        response: function(req) {
            log.trace(arguments);

            var list = [];
            var page = req.data.page;
            var offset = (page - 1) * 10 + 1;
            for(var i=offset; i<offset + 10; i++) {
                list.push({
                    id: i,
                    name: req.data.name || '项目' + i,
                    createTime: '2019-05-30 10:50:00',
                });
            }
            this.responseText = {
                msg: '',
                code: 0,
                data: list,
                count: 100,
            };
        }
    });

    mockjax({
        url: '/data/project/info',
        response: function(req) {
            log.trace(arguments);

            var id = req.data.id;
            this.responseText = {
                info: '',
                code: 0,
                data: {
                    id: id,
                    name: '项目' + id,
                    createTime: '2019-05-30 10:50:00',
                },
            };
        }
    });

    mockjax({
        url: '/data/project/save',
        response: function(req) {
            log.trace(arguments);

            this.responseText = {
                info: '',
                code: 0,
            };
        }
    });

    mockjax({
        url: '/data/project/del',
        response: function(req) {
            log.trace(arguments);

            this.responseText = {
                info: '',
                code: -10,
            };
        }
    });
    
    exports('mock', {});
});