layui.define(['jquery', 'element'], function(exports) {
    var $ = layui.jquery,
        element = layui.element,
        module = 'admin',
        selector = {
            adminBody: '#admin-body',
            tabsBody: 'layadmin-tabsbody-item',
            show: 'layui-show',
            hide: 'layui-hide',
            this: 'layui-this',
        };
    

    var result = {

        /**
         * 绑定事件
         */
        on: function(event, callback) {
            return layui.onevent.call(
                this, module, event, callback);
        },

        /**
         * 获取选项内容
         */
        tabsBody: function(index) {
            return $(selector.adminBody)
                .find('.' + selector.tabsBody)
                .eq(index || 0);
        },

        /**
         * 切换选项内容
         */
        tabsBodyChange: function(index, param) {
            param = param || {};
            this.tabsBody(index).addClass().siblings().removeClass();
            events.rollPage('auto', index);
            layui.event.call(this, module, 'tabsPage({*})', param);
        },

        /**
         * 
         */
        closeThisTabs: function() {

        },
    };

    var events = {

        /**
         * 
         */
        rollPage: function(type, index) {
            if('left' === type) {

            }
        },
    };

    exports('index', result);
});