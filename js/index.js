layui.use(['jquery', 'element', 'laytpl'], function($, element, laytpl) {
    var $body = $('body'),
        module = 'admin',
        tabsPage = {},
        frame = {
            body: '#admin-body',
            tabs: '#admin-tabs',
            tabsBody: '#admin-tabs-body',
            head: '#admin-head',
            menu: '#admin-menu',
        },
        clazz = {
            show: 'layui-show',
            this: 'layui-this',
            hide: 'layui-hide',
            tabsBodyItem: 'layadmin-tabsbody-item',
            iframe: 'layadmin-iframe',
            close: 'layui-tab-close',
        },
        filter = {
            tabs: 'admin-tabs',
            navs: 'admin-navs',
        };

    /**
     * 日志
     */
    var log = {

        args: function(sign, list) {
            var res = [sign];
            for(var i=0; i<list.length; i++) {
                res.push(list[i]);
            }
            return res;
        },

        todo: function(sign, list) {
            var args = this.args(sign, list);
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
    }

    /**
     * 主要逻辑
     */
    var logic = {

        /**
         * 注册事件
         */
        on: function(event, callback) {
            return layui.onevent.call(
                this, module, event, callback);
        },

        /**
         * 获取选项内容
         */
        tabsBody: function(index) {
            return $(frame.body)
                .find('.' + clazz.tabsBodyItem)
                .eq(index || 0);
        },

        /**
         * 切换标签内容
         */
        alterTabsBody: function(index, param) {
            param = param || {};
            this.tabsBody(index)
                .addClass(clazz.show)
                .siblings()
                .removeClass(clazz.show);
            layui.event.call(this, module, 'tabsPage({*})', param);
        },

        /**
         * 关闭标签内容
         */
        closeTabsBody: function() {
            if(tabsPage.index) {
                $(frame.tabsBody + '>li').eq(tabsPage.index)
                    .find('.' + clazz.close).trigger('click');
            }
        },

        /**
         * 打开标签内容
         */
        openTabsPage: function(href, text) {
            text = text || '新标签页';
            var found = false
                $li = $(frame.tabsBody + '>li');

            $li.each(function(index) {
                if($(this).attr('lay-id') === href) {
                    found = true;
                    tabsPage.index = index;
                }
            });

            if(!found) {
                var tpl = $('#tabsBodyItemTpl').html();
                var html = laytpl(tpl).render(href);
                $(frame.body).append(html);
                tabsPage.index = $li.length;
                element.tabAdd(filter.tabs, {
                    title: '<span>' + text + '</span>',
                    id: href,
                    attr: href,
                });
            }

            element.tabChange(filter.tabs, href);
            this.alterTabsBody(tabsPage.index, {
                url: href,
                text: text,
            });
        },

        /**
         * 进入全屏
         */
        fullScreen: function() {
            var doc = document.documentElement,
                fun = doc.requestFullscreen 
                || doc.webkitRequestFullScreen 
                || doc.mozRequestFullScreen 
                || doc.msRequestFullscreen;
            fun && fun.call(doc);
        },

        /**
         * 退出全屏
         */
        exitScreen: function() {
            var doc = document,
                fun = doc.exitFullscreen 
                || doc.mozCancelFullScreen 
                || doc.webkitCancelFullScreen 
                || doc.msExitFullscreen;
            fun && fun.call(doc);
        }
    };

    /**
     * 点击事件
     */
    var event = {
        /**
         * 伸缩
         */
        flexible: function() {
        },

        /**
         * 刷新
         */
        refresh: function() {
            var length = $('.' + clazz.tabsBodyItem).length;
            tabsPage.index >= length && (tabsPage.index = i - 1);
            var $iframe = logic.tabsBody(tabsPage.index).find('.' + clazz.iframe);
            $iframe.get(0).contentWindow.location.reload(true);
        },

        /**
         * 消息
         */
        message: function() {

        },

        /**
         * 便签
         */
        note: function() {

        },

        /**
         * 全屏
         */
        fullscreen: function() {
            var full = "layui-icon-screen-full",
                norm = "layui-icon-screen-restore",
                $i = $(this).children("i");
            $i.hasClass(full) 
                ? (logic.fullScreen(), $i.addClass(norm).removeClass(full)) 
                : (logic.exitScreen(), $i.addClass(full).removeClass(norm))
        },

        /**
         * 退出
         */
        logout: function() {

        },

        /**
         * 关闭所有选项
         */
        closeAllTabs: function() {
            event.closeOtherTabs('all');
        },

        /**
         * 关闭当前选项
         */
        closeThisTabs: function() {
            logic.closeTabsBody();
        },

        /**
         * 关闭其他选项
         */
        closeOtherTabs: function(type) {
            var sele = frame.tabsBody + '>li';
            if(type === 'all') {
                $(sele + ":gt(0)").remove();
                $(frame.body).find("." + clazz.tabsBodyItem + ":gt(0)").remove();
                $(sele).eq(0).trigger("click");
            }
            else {
                var cls = 'marked-for-deletion';
                $(sele).each(function(index, elem) {
                    if(index && index != tabsPage.index) {
                        $(elem).addClass(cls);
                        logic.tabsBody(index).addClass(cls);
                    }
                });
                $("." + cls).remove();
            }
        },

    };

    $body.on('click', '*[lay-href]', function() {
        var $this = $(this),
            href = $this.attr('lay-href'),
            text = $this.attr('lay-text') || $this.text();
        tabsPage.elem = $this;
        logic.openTabsPage(href, text);
    });
    $body.on('click', '*[lay-event]', function() {
        console.log('lay-event', this);

        var $this = $(this);
        var name = $this.attr('lay-event');
        event[name] && event[name].call(this);
    });
    // $body.on('click', '#admin-tabs-body>li', function() {
    //     console.log('lay-tabs', this);

    //     // var $this = $(this);
    //     // var index = $this.index();
    //     // tabsPage.type = 'tab';
    //     // tabsPage.index = index;
    //     // logic.alterTabsBody(index, {
    //     //     url: $this.attr('lay-attr'),
    //     // });
    // });

    // element.on('nav(' + filter.navs + ')', function($elem) {
    //     log.info('nav', $elem, this);
    //     var $ = $elem.parent();
    //     a.removeClass(y); 
    //     a.parent().removeClass(d);
    // });
    element.on('tab(' + filter.tabs + ')', function(data) {
        var $this = $(this);
        var index = $this.index();
        tabsPage.type = 'tab';
        tabsPage.index = index;
        logic.alterTabsBody(index, {
            url: $this.attr('lay-attr'),
        });
    });
    element.on('tabDelete(' + filter.tabs + ')', function(data) {
        var $li = $(frame.tabsBody + ">li.layui-this");
        if(data.index) {
            logic.tabsBody(data.index).remove();
            logic.alterTabsBody($li.index(), {
                url: $li.attr('lay-attr')
            });
            //logic.delResize();
        }
    });

    /*
    var $ = layui.jquery,
        element = layui.element,
        module = 'admin',
        $body = $('body'),
        //tabsPage = {},
        $cont = $('#');
        filter = {
            tabs: 'admin-tabs',
            menu: 'admin-menu',
            navs: 'admin-navs',
        },
        selector = {
            adminBody: '#admin-body',
            adminHead: '#admin-head',
            adminMenu: '#admin-menu',
            adminMenuBody: '#admin-menu-body',
            adminTabs: '#admin-tabs',
            adminTabsBody: '#admin-tabs-body',
            adminTabsBodyLi: '#admin-tabs-body>li',

            show: 'layui-show',
            hide: 'layui-hide',
            this: 'layui-this',

            tabsBodyItem: 'layadmin-tabsbody-item',
        };

    var main = {
        tabsPage: {},

        on: function(event, callback) {
            return layui.onevent.call(
                this, module, event, callback);
        },

        tabsBody: function(index) {
            return $(selector.adminBody)
                .find('.' + selector.tabsBodyItem)
                .eq(index || 0);
        },

        tabsBodyChange: function(index, param) {
            param = param || {};
            this.tabsBody(index)
                .addClass(selector.show)
                .siblings()
                .removeClass(selector.show);
            events.rollPage('auto', index);
            layui.event.call(this, module, 'tabsPage({*})', param);
        },

        closeThisTabs: function() {
            var index = this.tabsPage.index;
            if(index) {
                $(selector.adminTabsBody)
                    .eq(index).find(".layui-tab-close")
                    .trigger("click")
            }
        },

        openTabsPage: function(href, text) {
            var found = false, 
                //filter = 'admin-tabs',
                tabsPage = this.tabsPage,
                $li = $(selector.adminTabsBody + '>li'),
                trim = href.replace(/(^http(s*):)|(\?[\s\S]*$)/g, "");
    
            $li.each(function(index) {
                var $this = $(this),
                    id = $this.attr("lay-id");
                if(id === href) {
                    found = true;
                    tabsPage.index = index;
                }
            });
    
            text = text || "新标签页";
    
            if (!found) {
                var html = [
                    '<div class="layadmin-tabsbody-item layui-show">', 
                    '<iframe src="' + href + '" frameborder="0" class="layadmin-iframe"></iframe>', 
                    '</div>'
                ];
                $(selector.adminBody).append(html.join(''));
                tabsPage.index = $li.length;
                element.tabAdd(filter.tabs, {
                    title: "<span>" + text + "</span>",
                    id: href,
                    attr: trim
                });
            }
    
            element.tabChange(filter.tabs, href),
            main.tabsBodyChange(tabsPage.index, {
                url: href,
                text: text
            })
        },

        resize: function() {

        },

        delResize: function() {
            //this.resize('off');
        }
    };

    var event = {

        rollPage: function(type, index) {
            if('left' === type) {

            }
            else {
                
            }
        },

        closeThisTabs: function() {

        },
    };


    // 系统事件
    $body.on('click', '*[lay-href]', function() {
        var $this = $(this),
            href = $this.attr('lay-href'),
            text = $this.attr('lay-text');
        main.tabsPage.elem = $this;
        main.openTabsPage(href, text || $this.text());
    });
    $body.on('click', selector.adminTabsBodyLi, function() {
        var $this = $(this)
            index = $this.index();
        main.tabsPage.type = 'tab';
        main.tabsPage.index = index;
        main.tabsBodyChange($li.index(), {
            url: $li.attr('lay-attr')
        });
    });
    $body.on('click', '*[layadmin-event]', function() {
        var $this = $(this);
        var name = $this.attr('layadmin-event');
        event[name] && event[name].call(this, $this);
    });

    element.on('nav(' + filter.menu + ')', function($elem) {
        if($elem.siblings(".layui-nav-child")[0] && $cont.hasClass('layadmin-side-shrink')) {
            main.sideFlexible("spread");
            layer.close($elem.data("index"));
            main.tabsPage.type = "nav";
        }
    });
    element.on('nav(' + filter.navs + ')', function($elem) {
        var a = $elem.parent();
        a.removeClass(y); 
        a.parent().removeClass(d);
    });
    element.on('tab(' + filter.tabs + ')', function(data) {
        main.tabsPage.index = data.index;
    });
    element.on('tabDelete(' + filter.tabs + ')', function(data) {
        var $li = $(selector.adminTabsBody + ">li.layui-this");
        if(data.index) {
            main.tabsBody(data.index).remove();
            main.tabsBodyChange($li.index(), {
                url: $li.attr('lay-attr')
            });
            main.delResize();
        }
    });
*/
});