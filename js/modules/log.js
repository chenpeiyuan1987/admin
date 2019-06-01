layui.define([], function(exports) {

    var log = {

        /**
         * 打印日志
         */
        todo: function(sign, list) {
            var args = [sign];
            for(var i=0; i<list.length; i++) {
                args.push(list[i]);
            }

            console.log.apply(null, args);
        },

        /**
         * 追踪
         */
        trace: function() {
            this.todo('[T]', arguments);
        },

        /**
         * 调试
         */
        debug: function() {
            this.todo('[D]', arguments);
        },

        /**
         * 信息
         */
        info: function() {
            this.todo('[I]', arguments);
        },

        /**
         * 警告
         */
        warn: function() {
            this.todo('[W]', arguments);
        },

        /**
         * 错误
         */
        error: function() {
            this.todo('[E]', arguments);
        }
    };

    exports('log', log);
});