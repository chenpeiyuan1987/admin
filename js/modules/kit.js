layui.define(['jquery', 'layer'], function(exports) {
    var $ = layui.$,
        layer = layui.layer;

    var kit = {

        /**
         * 参数
         */
        args: function(names, search) {
            if (!search) {
                search = location.search;
            }

            names = typeof names === 'string' 
                ? [names] 
                : names;

            var obj = {};
            names.forEach(function(name) {
                var regex = RegExp('[&?]' + name + '=([^&]*)');
                var match = regex.exec(search);
                obj[name] = match ? decodeURIComponent(match[1]) : null;
            });
            
            return obj;
        },

        /**
         * 错误
         */
        err: function(msg, opt) {
            return this.pop($.extend({
                content: '<cite>错误：</cite>' + msg,
                maxWidth: 300,
                offset: 't',
                anim: 6,
                id: 'admin-err',
            }, opt));
        },

        /**
         * 弹窗
         */
        pop: function(opt) {
            var success = opt.success;
            delete opt.success;

            return layer.open($.extend({
                type: 1,
                title: '提示',
                content: '',
                id: 'admin-pop',
                shadeClose: true,
                //closeBtn: false,
                skin: "layui-layer-admin",
                success: function($elem, index) {
                    var $icon = $('<i class="layui-icon" close>&#x1006;</i>');
                    $elem.append($icon);
                    $icon.on("click", function () {
                        layer.close(index)
                    }); 
                    success && success.apply(this, arguments);
                }
            }, opt));
        },

        /**
         * 请求
         */
        req: function(opt) {
            var self = this;
            var success = opt.success,
                error = opt.error,
                done = opt.done;
            delete opt.success;
            delete opt.error;
            delete opt.done;

            $.ajax($.extend({
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if(res.code == 0) {
                        done && done(res);
                    }
                    else if(res.code == -11) {
                        self.pop({
                            content: '登录已过期，请重新登录',
                        });
                    }
                    else {
                        self.err(res.info || '网络访问异常');
                    }
                    success && success(res);
                },
                error: function(request, status) {
                    error && error(request, status);
                }
            }, opt));
        }
    };

    exports('kit', kit);
});