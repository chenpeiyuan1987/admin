layui.config({
    base: '/js/modules/',
}).use(['jquery', 'element', 'laytpl', 'log'], function($, element, laytpl, log) {
    var $body = $('body'),
        module = 'admin',
        tabsPage = {},
        frame = {
            body: '#admin-body',
            tabs: '#admin-tabs',
            tabsBody: '#admin-tabs-body',
            head: '#admin-head',
            menu: '#admin-menu',
            menuBody: '#admin-menu-body',
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
            event.rollPage('auto', index);
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
                $(frame.tabsBody).children('li:first')
                    .trigger('click').siblings().remove();
                $(frame.body).children("." + clazz.tabsBodyItem + ":gt(0)")
                    .remove();
            }
            else {
                var marked = 'marked-for-deletion';
                $(sele).each(function(index, elem) {
                    if(index && index != tabsPage.index) {
                        $(elem).addClass(marked);
                        logic.tabsBody(index).addClass(marked);
                    }
                });
                $("." + marked).remove();
            }
        },

        /**
         * 左移选项
         */
        leftPage: function() {
            event.rollPage('left');
        },

        /**
         * 右移选项
         */
        rightPage: function() {
            event.rollPage();
        },

        /**
         * 移动选项
         */
        rollPage: function(type, index) {
            var $tabsBody = $(frame.tabsBody);
            var $li = $tabsBody.children('li');
            var width = $tabsBody.outerWidth();
            var left = parseFloat($tabsBody.css('left'));

            if(type === 'left') {
                if(!left && left <= 0) {
                    return;
                }
                var diff = -left - width;
                $li.each(function(index, elem) {
                    var $this = $(this),
                        left = $this.position().left;
                    if(left >= diff) {
                        $tabsBody.css('left', -left);
                        return false;
                    }
                });
                return;
            }
            
            if(type === 'auto') {
                var $e = $li.eq(index);
                if($e.length > 0) {
                    var l = $e.position().left;
                    if(l < -left) {
                        $tabsBody.css('left', -l);
                        return;
                    }
                    var r = l + $e.outerWidth();
                    if(r >= (width - left)) {
                        var diff = r - (width - left);
                        $li.each(function(index, elem) {
                            var $this = $(this),
                                l = $this.position().left;
                            if(l + left > diff) {
                                $tabsBody.css('left', -l);
                                return false;
                            }
                        });
                    }
                }
                return;
            }

            $li.each(function(index, elem) {
                var $this = $(this);
                    right = $this.position().left + $this.outerWidth();
                if(right >= width - left) {
                    $tabsBody.css('left', -$this.position().left);
                    return false;
                }
            });
        }
    };

    logic.on('tabsPage(setMenustatus)', function(param) {
        var url = param.url,
            $body = $(frame.menuBody),
            handle = function($e) {
                $e.each(function() {
                    var $this = $(this),
                        $dd = $this.children('.layui-nav-child').children('dd'),
                        href = $this.children('*[lay-href]').attr('lay-href');
                    if(href === url) {
                        $this.addClass(clazz.this);
                        return false;
                    }
                    handle($dd);
                });
            };
        $body.find('.' + clazz.this).removeClass(clazz.this);
        handle($body.children('li'));
    });

    $body.on('click', '*[lay-href]', function() {
        log.info('lay-href', this);

        var $this = $(this),
            href = $this.attr('lay-href'),
            text = $this.attr('lay-text') || $this.text();
        tabsPage.elem = $this;
        logic.openTabsPage(href, text);
    });
    $body.on('click', '*[lay-event]', function() {
        log.info('lay-event', this);

        var $this = $(this);
        var name = $this.attr('lay-event');
        event[name] && event[name].call(this);
    });

    element.on('tab(' + filter.tabs + ')', function(data) {
        log.info('tab(' + filter.tabs + ')', data);

        var $this = $(this);
        var index = $this.index();
        tabsPage.type = 'tab';
        tabsPage.index = index;
        logic.alterTabsBody(index, {
            url: $this.attr('lay-attr'),
        });
    });
    element.on('tabDelete(' + filter.tabs + ')', function(data) {
        log.info('tabDelete(' + filter.tabs + ')', data);

        if(data.index) {
            logic.tabsBody(data.index).remove();
        }
    });

    //
    $('[lay-href="/html/user/list.html"]').click();
});