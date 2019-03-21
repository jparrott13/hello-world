(function(e) {
    var t = {};
    var n = {
        mode: "horizontal",
        slideSelector: "",
        infiniteLoop: true,
        hideControlOnEnd: false,
        speed: 500,
        easing: null,
        slideMargin: 0,
        startSlide: 0,
        randomStart: false,
        captions: false,
        ticker: false,
        tickerHover: false,
        adaptiveHeight: false,
        adaptiveHeightSpeed: 500,
        video: false,
        useCSS: true,
        preloadImages: "visible",
        responsive: true,
        touchEnabled: true,
        swipeThreshold: 50,
        oneToOneTouch: true,
        preventDefaultSwipeX: true,
        preventDefaultSwipeY: false,
        pager: true,
        pagerType: "full",
        pagerShortSeparator: " / ",
        pagerSelector: null,
        buildPager: null,
        pagerCustom: null,
        autoHidePager: false,
        controls: true,
        nextText: "",
        prevText: "",
        nextSelector: null,
        prevSelector: null,
        autoControls: false,
        startText: "Start",
        stopText: "Stop",
        autoControlsCombine: false,
        autoControlsSelector: null,
        auto: false,
        pause: 4e3,
        autoStart: true,
        autoDirection: "next",
        autoHover: false,
        autoDelay: 0,
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 0,
        slideWidth: 0,
        onSliderLoad: function() {},
        onSlideBefore: function() {},
        onSlideAfter: function() {},
        onSlideNext: function() {},
        onSlidePrev: function() {}
    };
    e.fn.bxSlider = function(r) {
        if (this.length == 0) return this;
        if (this.length > 1) {
            this.each(function() {
                e(this).bxSlider(r)
            });
            return this
        }
        var s = {};
        var o = this;
        t.el = this;
        var u = e(window).width();
        var a = e(window).height();
        var f = function() {
            s.settings = e.extend({}, n, r);
            s.settings.slideWidth = parseInt(s.settings.slideWidth);
            s.children = o.children(s.settings.slideSelector);
            if (s.children.length < s.settings.minSlides) s.settings.minSlides = s.children.length;
            if (s.children.length < s.settings.maxSlides) s.settings.maxSlides = s.children.length;
            if (s.settings.randomStart) s.settings.startSlide = Math.floor(Math.random() * s.children.length);
            s.active = {
                index: s.settings.startSlide
            };
            s.carousel = s.settings.minSlides > 1 || s.settings.maxSlides > 1;
            if (s.carousel) s.settings.preloadImages = "all";
            s.minThreshold = s.settings.minSlides * s.settings.slideWidth + (s.settings.minSlides - 1) * s.settings.slideMargin;
            s.maxThreshold = s.settings.maxSlides * s.settings.slideWidth + (s.settings.maxSlides - 1) * s.settings.slideMargin;
            s.working = false;
            s.controls = {};
            s.interval = null;
            s.animProp = s.settings.mode == "vertical" ? "top" : "left";
            s.usingCSS = s.settings.useCSS && s.settings.mode != "fade" && function() {
                var e = document.createElement("div");
                var t = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                for (var n in t) {
                    if (e.style[t[n]] !== undefined) {
                        s.cssPrefix = t[n].replace("Perspective", "").toLowerCase();
                        s.animProp = "-" + s.cssPrefix + "-transform";
                        return true
                    }
                }
                return false
            }();
            if (s.settings.mode == "vertical") s.settings.maxSlides = s.settings.minSlides;
            o.data("origStyle", o.attr("style"));
            o.children(s.settings.slideSelector).each(function() {
                e(this).data("origStyle", e(this).attr("style"))
            });
            l()
        };
        var l = function() {
            o.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');
            s.viewport = o.parent();
            s.loader = e('<div class="bx-loading" />');
            s.viewport.prepend(s.loader);
            o.css({
                width: s.settings.mode == "horizontal" ? s.children.length * 100 + 215 + "%" : "auto",
                position: "relative"
            });
            if (s.usingCSS && s.settings.easing) {
                o.css("-" + s.cssPrefix + "-transition-timing-function", s.settings.easing)
            } else if (!s.settings.easing) {
                s.settings.easing = "swing"
            }
            var t = m();
            s.viewport.css({
                width: "100%",
                overflow: "hidden",
                position: "relative"
            });
            s.viewport.parent().css({
                maxWidth: d()
            });
            if (!s.settings.pager) {
                s.viewport.parent().css({
                    margin: "0 auto 0px"
                })
            }
            s.children.css({
                "float": s.settings.mode == "horizontal" ? "left" : "none",
                listStyle: "none",
                position: "relative"
            });
            s.children.css("width", v());
            if (s.settings.mode == "horizontal" && s.settings.slideMargin > 0) s.children.css("marginRight", s.settings.slideMargin);
            if (s.settings.mode == "vertical" && s.settings.slideMargin > 0) s.children.css("marginBottom", s.settings.slideMargin);
            if (s.settings.mode == "fade") {
                s.children.css({
                    position: "absolute",
                    zIndex: 0,
                    display: "none"
                });
                s.children.eq(s.settings.startSlide).css({
                    zIndex: 50,
                    display: "block"
                })
            }
            s.controls.el = e('<div class="bx-controls" />');
            if (s.settings.captions) N();
            s.active.last = s.settings.startSlide == g() - 1;
            if (s.settings.video) o.fitVids();
            var n = s.children.eq(s.settings.startSlide);
            if (s.settings.preloadImages == "all") n = s.children;
            if (!s.settings.ticker) {
                if (s.settings.pager) S();
                if (s.settings.controls) x();
                if (s.settings.auto && s.settings.autoControls) T();
                if (s.settings.controls || s.settings.autoControls || s.settings.pager) s.viewport.after(s.controls.el)
            } else {
                s.settings.pager = false
            }
            c(n, h)
        };
        var c = function(t, n) {
            var r = t.find("img, iframe").length;
            if (r == 0) {
                n();
                return
            }
            var i = 0;
            t.find("img, iframe").each(function() {
                e(this).one("load", function() {
                    if (++i == r) n()
                }).each(function() {
                    if (this.complete) e(this).load()
                })
            })
        };
        var h = function() {
            if (s.settings.infiniteLoop && s.settings.mode != "fade" && !s.settings.ticker) {
                var t = s.settings.mode == "vertical" ? s.settings.minSlides : s.settings.maxSlides;
                var n = s.children.slice(0, t).clone().addClass("bx-clone");
                var r = s.children.slice(-t).clone().addClass("bx-clone");
                o.append(n).prepend(r)
            }
            s.loader.remove();
            b();
            if (s.settings.mode == "vertical") s.settings.adaptiveHeight = true;
            s.viewport.height(p());
            o.redrawSlider();
            s.settings.onSliderLoad(s.active.index);
            s.initialized = true;
            if (s.settings.responsive) e(window).bind("resize", U);
            if (s.settings.auto && s.settings.autoStart) H();
            if (s.settings.ticker) B();
            if (s.settings.pager) M(s.settings.startSlide);
            if (s.settings.controls) P();
            if (s.settings.touchEnabled && !s.settings.ticker) F()
        };
        var p = function() {
            var t = 0;
            var n = e();
            if (s.settings.mode != "vertical" && !s.settings.adaptiveHeight) {
                n = s.children
            } else {
                if (!s.carousel) {
                    n = s.children.eq(s.active.index)
                } else {
                    var r = s.settings.moveSlides == 1 ? s.active.index : s.active.index * y();
                    n = s.children.eq(r);
                    for (i = 1; i <= s.settings.maxSlides - 1; i++) {
                        if (r + i >= s.children.length) {
                            n = n.add(s.children.eq(i - 1))
                        } else {
                            n = n.add(s.children.eq(r + i))
                        }
                    }
                }
            }
            if (s.settings.mode == "vertical") {
                n.each(function(n) {
                    t += e(this).outerHeight()
                });
                if (s.settings.slideMargin > 0) {
                    t += s.settings.slideMargin * (s.settings.minSlides - 1)
                }
            } else {
                t = Math.max.apply(Math, n.map(function() {
                    return e(this).outerHeight(false)
                }).get())
            }
            return t
        };
        var d = function() {
            var e = "100%";
            if (s.settings.slideWidth > 0) {
                if (s.settings.mode == "horizontal") {
                    e = s.settings.maxSlides * s.settings.slideWidth + (s.settings.maxSlides - 1) * s.settings.slideMargin
                } else {
                    e = s.settings.slideWidth
                }
            }
            return e
        };
        var v = function() {
            var e = s.settings.slideWidth;
            var t = s.viewport.width();
            if (s.settings.slideWidth == 0 || s.settings.slideWidth > t && !s.carousel || s.settings.mode == "vertical") {
                e = t
            } else if (s.settings.maxSlides > 1 && s.settings.mode == "horizontal") {
                if (t > s.maxThreshold) {} else if (t < s.minThreshold) {
                    e = (t - s.settings.slideMargin * (s.settings.minSlides - 1)) / s.settings.minSlides
                }
            }
            return e
        };
        var m = function() {
            var e = 1;
            if (s.settings.mode == "horizontal" && s.settings.slideWidth > 0) {
                if (s.viewport.width() < s.minThreshold) {
                    e = s.settings.minSlides
                } else if (s.viewport.width() > s.maxThreshold) {
                    e = s.settings.maxSlides
                } else {
                    var t = s.children.first().width();
                    e = Math.floor(s.viewport.width() / t)
                }
            } else if (s.settings.mode == "vertical") {
                e = s.settings.minSlides
            }
            return e
        };
        var g = function() {
            var e = 0;
            if (s.settings.moveSlides > 0) {
                if (s.settings.infiniteLoop) {
                    e = s.children.length / y()
                } else {
                    var t = 0;
                    var n = 0;
                    while (t < s.children.length) {
                        ++e;
                        t = n + m();
                        n += s.settings.moveSlides <= m() ? s.settings.moveSlides : m()
                    }
                }
            } else {
                e = Math.ceil(s.children.length / m())
            }
            return e
        };
        var y = function() {
            if (s.settings.moveSlides > 0 && s.settings.moveSlides <= m()) {
                return s.settings.moveSlides
            }
            return m()
        };
        var b = function() {
            if (s.children.length > s.settings.maxSlides && s.active.last && !s.settings.infiniteLoop) {
                if (s.settings.mode == "horizontal") {
                    var e = s.children.last();
                    var t = e.position();
                    w(-(t.left - (s.viewport.width() - e.width())), "reset", 0)
                } else if (s.settings.mode == "vertical") {
                    var n = s.children.length - s.settings.minSlides;
                    var t = s.children.eq(n).position();
                    w(-t.top, "reset", 0)
                }
            } else {
                var t = s.children.eq(s.active.index * y()).position();
                if (s.active.index == g() - 1) s.active.last = true;
                if (t != undefined) {
                    if (s.settings.mode == "horizontal") w(-t.left, "reset", 0);
                    else if (s.settings.mode == "vertical") w(-t.top, "reset", 0)
                }
            }
        };
        var w = function(e, t, n, r) {
            if (s.usingCSS) {
                var i = s.settings.mode == "vertical" ? "translate3d(0, " + e + "px, 0)" : "translate3d(" + e + "px, 0, 0)";
                o.css("-" + s.cssPrefix + "-transition-duration", n / 1e3 + "s");
                if (t == "slide") {
                    o.css(s.animProp, i);
                    o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                        _()
                    })
                } else if (t == "reset") {
                    o.css(s.animProp, i)
                } else if (t == "ticker") {
                    o.css("-" + s.cssPrefix + "-transition-timing-function", "linear");
                    o.css(s.animProp, i);
                    o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                        o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
                        w(r["resetValue"], "reset", 0);
                        j()
                    })
                }
            } else {
                var u = {};
                u[s.animProp] = e;
                if (t == "slide") {
                    o.animate(u, n, s.settings.easing, function() {
                        _()
                    })
                } else if (t == "reset") {
                    o.css(s.animProp, e)
                } else if (t == "ticker") {
                    o.animate(u, speed, "linear", function() {
                        w(r["resetValue"], "reset", 0);
                        j()
                    })
                }
            }
        };
        var E = function() {
            var t = "";
            var n = g();
            for (var r = 0; r < n; r++) {
                var i = "";
                if (s.settings.buildPager && e.isFunction(s.settings.buildPager)) {
                    i = s.settings.buildPager(r);
                    s.pagerEl.addClass("bx-custom-pager")
                } else {
                    i = r + 1;
                    s.pagerEl.addClass("bx-default-pager")
                }
                t += '<div class="bx-pager-item"><a href="" data-slide-index="' + r + '" class="bx-pager-link">' + i + "</a></div>"
            }
            if (n > 1 || !s.settings.autoHidePager) {
                s.pagerEl.html(t)
            } else {
                s.pagerEl.empty()
            }
        };
        var S = function() {
            if (!s.settings.pagerCustom) {
                s.pagerEl = e('<div class="bx-pager" />');
                if (s.settings.pagerSelector) {
                    e(s.settings.pagerSelector).html(s.pagerEl)
                } else {
                    s.controls.el.addClass("bx-has-pager").append(s.pagerEl)
                }
                E()
            } else {
                s.pagerEl = e(s.settings.pagerCustom)
            }
            s.pagerEl.delegate("a", "click", O)
        };
        var x = function() {
            s.controls.next = e('<a class="bx-next" role="img" aria-label="Next" href="#/">' + s.settings.nextText + "</a>");
            s.controls.prev = e('<a class="bx-prev" role="img" aria-label="Previous" href="#/">' + s.settings.prevText + "</a>");
            s.controls.next.bind("click", C);
            s.controls.prev.bind("click", k);
            if (s.settings.nextSelector) {
                e(s.settings.nextSelector).append(s.controls.next)
            }
            if (s.settings.prevSelector) {
                e(s.settings.prevSelector).append(s.controls.prev)
            }
            if (!s.settings.nextSelector && !s.settings.prevSelector) {
                s.controls.directionEl = e('<div class="bx-controls-direction" />');
                s.controls.directionEl.append(s.controls.prev).append(s.controls.next);
                s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl)
            }
        };
        var T = function() {
            s.controls.start = e('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + s.settings.startText + "</a></div>");
            s.controls.stop = e('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + s.settings.stopText + "</a></div>");
            s.controls.autoEl = e('<div class="bx-controls-auto" />');
            s.controls.autoEl.delegate(".bx-start", "click", L);
            s.controls.autoEl.delegate(".bx-stop", "click", A);
            if (s.settings.autoControlsCombine) {
                s.controls.autoEl.append(s.controls.start)
            } else {
                s.controls.autoEl.append(s.controls.start).append(s.controls.stop)
            }
            if (s.settings.autoControlsSelector) {
                e(s.settings.autoControlsSelector).html(s.controls.autoEl)
            } else {
                s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl)
            }
            D(s.settings.autoStart ? "stop" : "start")
        };
        var N = function() {
            s.children.each(function(t) {
                var n = e(this).find("img:first").attr("title");
                if (n != undefined && ("" + n).length) {
                    e(this).append('<div class="bx-caption"><span>' + n + "</span></div>")
                }
            })
        };
        var C = function(e) {
            if (s.settings.auto) o.stopAuto();
            o.goToNextSlide();
            e.preventDefault()
        };
        var k = function(e) {
            if (s.settings.auto) o.stopAuto();
            o.goToPrevSlide();
            e.preventDefault()
        };
        var L = function(e) {
            o.startAuto();
            e.preventDefault()
        };
        var A = function(e) {
            o.stopAuto();
            e.preventDefault()
        };
        var O = function(t) {
            if (s.settings.auto) o.stopAuto();
            var n = e(t.currentTarget);
            var r = parseInt(n.attr("data-slide-index"));
            if (r != s.active.index) o.goToSlide(r);
            t.preventDefault()
        };
        var M = function(t) {
            var n = s.children.length;
            if (s.settings.pagerType == "short") {
                if (s.settings.maxSlides > 1) {
                    n = Math.ceil(s.children.length / s.settings.maxSlides)
                }
                s.pagerEl.html(t + 1 + s.settings.pagerShortSeparator + n);
                return
            }
            s.pagerEl.find("a").removeClass("active");
            s.pagerEl.each(function(n, r) {
                e(r).find("a").eq(t).addClass("active")
            })
        };
        var _ = function() {
            if (s.settings.infiniteLoop) {
                var e = "";
                if (s.active.index == 0) {
                    e = s.children.eq(0).position()
                } else if (s.active.index == g() - 1 && s.carousel) {
                    e = s.children.eq((g() - 1) * y()).position()
                } else if (s.active.index == s.children.length - 1) {
                    e = s.children.eq(s.children.length - 1).position()
                }
                if (s.settings.mode == "horizontal") {
                    w(-e.left, "reset", 0);
                } else if (s.settings.mode == "vertical") {
                    w(-e.top, "reset", 0);
                }
            }
            s.working = false;
            s.settings.onSlideAfter(s.children.eq(s.active.index), s.oldIndex, s.active.index)
        };
        var D = function(e) {
            if (s.settings.autoControlsCombine) {
                s.controls.autoEl.html(s.controls[e])
            } else {
                s.controls.autoEl.find("a").removeClass("active");
                s.controls.autoEl.find("a:not(.bx-" + e + ")").addClass("active")
            }
        };
        var P = function() {
            if (g() == 1) {
                s.controls.prev.addClass("disabled");
                s.controls.next.addClass("disabled")
            } else if (!s.settings.infiniteLoop && s.settings.hideControlOnEnd) {
                if (s.active.index == 0) {
                    s.controls.prev.addClass("disabled");
                    s.controls.next.removeClass("disabled")
                } else if (s.active.index == g() - 1) {
                    s.controls.next.addClass("disabled");
                    s.controls.prev.removeClass("disabled")
                } else {
                    s.controls.prev.removeClass("disabled");
                    s.controls.next.removeClass("disabled")
                }
            }
        };
        var H = function() {
            if (s.settings.autoDelay > 0) {
                var e = setTimeout(function() {
                    o.startAuto()
                }, s.settings.autoDelay)
            } else {
                o.startAuto()
            }
            if (s.settings.autoHover) {
                o.hover(function() {
                    if (s.interval) {
                        o.stopAuto(true);
                        s.autoPaused = true
                    }
                }, function() {
                    if (s.autoPaused) {
                        o.startAuto(true);
                        s.autoPaused = null
                    }
                })
            }
        };
        var B = function() {
            var t = 0;
            if (s.settings.autoDirection == "next") {
                o.append(s.children.clone().addClass("bx-clone"))
            } else {
                o.prepend(s.children.clone().addClass("bx-clone"));
                var n = s.children.first().position();
                t = s.settings.mode == "horizontal" ? -n.left : -n.top
            }
            w(t, "reset", 0);
            s.settings.pager = false;
            s.settings.controls = false;
            s.settings.autoControls = false;
            if (s.settings.tickerHover && !s.usingCSS) {
                s.viewport.hover(function() {
                    o.stop()
                }, function() {
                    var t = 0;
                    s.children.each(function(n) {
                        t += s.settings.mode == "horizontal" ? e(this).outerWidth(true) : e(this).outerHeight(true)
                    });
                    var n = s.settings.speed / t;
                    var r = s.settings.mode == "horizontal" ? "left" : "top";
                    var i = n * (t - Math.abs(parseInt(o.css(r))));
                    j(i)
                })
            }
            j()
        };
        var j = function(e) {
            speed = e ? e : s.settings.speed;
            var t = {
                left: 0,
                top: 0
            };
            var n = {
                left: 0,
                top: 0
            };
            if (s.settings.autoDirection == "next") {
                t = o.find(".bx-clone").first().position()
            } else {
                n = s.children.first().position()
            }
            var r = s.settings.mode == "horizontal" ? -t.left : -t.top;
            var i = s.settings.mode == "horizontal" ? -n.left : -n.top;
            var u = {
                resetValue: i
            };
            w(r, "ticker", speed, u)
        };
        var F = function() {
            s.touch = {
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            s.viewport.bind("touchstart", I)
        };
        var I = function(e) {
            if (s.working) {
                e.preventDefault()
            } else {
                s.touch.originalPos = o.position();
                var t = e.originalEvent;
                s.touch.start.x = t.changedTouches[0].pageX;
                s.touch.start.y = t.changedTouches[0].pageY;
                s.viewport.bind("touchmove", q);
                s.viewport.bind("touchend", R)
            }
        };
        var q = function(e) {
            var t = e.originalEvent;
            var n = Math.abs(t.changedTouches[0].pageX - s.touch.start.x);
            var r = Math.abs(t.changedTouches[0].pageY - s.touch.start.y);
            if (n * 3 > r && s.settings.preventDefaultSwipeX) {
                e.preventDefault()
            } else if (r * 3 > n && s.settings.preventDefaultSwipeY) {
                e.preventDefault()
            }
            if (s.settings.mode != "fade" && s.settings.oneToOneTouch) {
                var i = 0;
                if (s.settings.mode == "horizontal") {
                    var o = t.changedTouches[0].pageX - s.touch.start.x;
                    i = s.touch.originalPos.left + o
                } else {
                    var o = t.changedTouches[0].pageY - s.touch.start.y;
                    i = s.touch.originalPos.top + o
                }
                w(i, "reset", 0)
            }
        };
        var R = function(e) {
            s.viewport.unbind("touchmove", q);
            var t = e.originalEvent;
            var n = 0;
            s.touch.end.x = t.changedTouches[0].pageX;
            s.touch.end.y = t.changedTouches[0].pageY;
            if (s.settings.mode == "fade") {
                var r = Math.abs(s.touch.start.x - s.touch.end.x);
                if (r >= s.settings.swipeThreshold) {
                    s.touch.start.x > s.touch.end.x ? o.goToNextSlide() : o.goToPrevSlide();
                    o.stopAuto()
                }
            } else {
                var r = 0;
                if (s.settings.mode == "horizontal") {
                    r = s.touch.end.x - s.touch.start.x;
                    n = s.touch.originalPos.left
                } else {
                    r = s.touch.end.y - s.touch.start.y;
                    n = s.touch.originalPos.top
                }
                if (!s.settings.infiniteLoop && (s.active.index == 0 && r > 0 || s.active.last && r < 0)) {
                    w(n, "reset", 200)
                } else {
                    if (Math.abs(r) >= s.settings.swipeThreshold) {
                        r < 0 ? o.goToNextSlide() : o.goToPrevSlide();
                        o.stopAuto()
                    } else {
                        w(n, "reset", 200)
                    }
                }
            }
            s.viewport.unbind("touchend", R)
        };
        var U = function(t) {
            var n = e(window).width();
            var r = e(window).height();
            if (u != n || a != r) {
                u = n;
                a = r;
                o.redrawSlider()
            }
        };
        o.goToSlide = function(t, n) {
            if (s.working || s.active.index == t) return;
            s.working = true;
            s.oldIndex = s.active.index;
            if (t < 0) {
                s.active.index = g() - 1
            } else if (t >= g()) {
                s.active.index = 0
            } else {
                s.active.index = t
            }
            s.settings.onSlideBefore(s.children.eq(s.active.index), s.oldIndex, s.active.index);
            if (n == "next") {
                s.settings.onSlideNext(s.children.eq(s.active.index), s.oldIndex, s.active.index)
            } else if (n == "prev") {
                s.settings.onSlidePrev(s.children.eq(s.active.index), s.oldIndex, s.active.index)
            }
            s.active.last = s.active.index >= g() - 1;
            if (s.settings.pager) M(s.active.index);
            if (s.settings.controls) P();
            if (s.settings.mode == "fade") {
                if (s.settings.adaptiveHeight && s.viewport.height() != p()) {
                    s.viewport.animate({
                        height: p()
                    }, s.settings.adaptiveHeightSpeed)
                }
                s.children.filter(":visible").fadeOut(s.settings.speed).css({
                    zIndex: 0
                });
                s.children.eq(s.active.index).css("zIndex", 51).fadeIn(s.settings.speed, function() {
                    e(this).css("zIndex", 50);
                    _()
                })
            } else {
                if (s.settings.adaptiveHeight && s.viewport.height() != p()) {
                    s.viewport.animate({
                        height: p()
                    }, s.settings.adaptiveHeightSpeed)
                }
                var r = 0;
                var i = {
                    left: 0,
                    top: 0
                };
                if (!s.settings.infiniteLoop && s.carousel && s.active.last) {
                    if (s.settings.mode == "horizontal") {
                        var u = s.children.eq(s.children.length - 1);
                        i = u.position();
                        r = s.viewport.width() - u.outerWidth()
                    } else {
                        var a = s.children.length - s.settings.minSlides;
                        i = s.children.eq(a).position()
                    }
                } else if (s.carousel && s.active.last && n == "prev") {
                    var f = s.settings.moveSlides == 1 ? s.settings.maxSlides - y() : (g() - 1) * y() - (s.children.length - s.settings.maxSlides);
                    var u = o.children(".bx-clone").eq(f);
                    i = u.position()
                } else if (n == "next" && s.active.index == 0) {
                    i = o.find("> .bx-clone").eq(s.settings.maxSlides).position();
                    s.active.last = false
                } else if (t >= 0) {
                    var l = t * y();
                    i = s.children.eq(l).position()
                }
                if ("undefined" !== typeof i) {
                    var c = s.settings.mode == "horizontal" ? -(i.left - r) : -i.top;
                    w(c, "slide", s.settings.speed)
                }
            }
        };
        o.goToNextSlide = function() {
            if (!s.settings.infiniteLoop && s.active.last) return;
            var e = parseInt(s.active.index) + 1;
            o.goToSlide(e, "next")
        };
        o.goToPrevSlide = function() {
            if (!s.settings.infiniteLoop && s.active.index == 0) return;
            var e = parseInt(s.active.index) - 1;
            o.goToSlide(e, "prev")
        };
        o.startAuto = function(e) {
            if (s.interval) return;
            s.interval = setInterval(function() {
                var e = g();
                if (e > 1 || !s.settings.autoHidePager) {
                    s.settings.autoDirection == "next" ? o.goToNextSlide() : o.goToPrevSlide()
                }
            }, s.settings.pause);
            if (s.settings.autoControls && e != true) D("stop")
        };
        o.stopAuto = function(e) {
            if (!s.interval) return;
            clearInterval(s.interval);
            s.interval = null;
            if (s.settings.autoControls && e != true) D("start")
        };
        o.getCurrentSlide = function() {
            return s.active.index
        };
        o.getSlideCount = function() {
            return s.children.length
        };
        o.redrawSlider = function() {
            s.children.add(o.find(".bx-clone")).outerWidth(v());
            s.viewport.css("height", p());
            if (!s.settings.ticker) b();
            if (s.active.last) s.active.index = g() - 1;
            if (s.active.index >= g()) s.active.last = true;
            if (s.settings.pager && !s.settings.pagerCustom) {
                E();
                M(s.active.index)
            }
        };
        o.destroySlider = function() {
            if (!s.initialized) return;
            s.initialized = false;
            e(".bx-clone", this).remove();
            s.children.each(function() {
                e(this).data("origStyle") != undefined ? e(this).attr("style", e(this).data("origStyle")) : e(this).removeAttr("style")
            });
            e(this).data("origStyle") != undefined ? this.attr("style", e(this).data("origStyle")) : e(this).removeAttr("style");
            e(this).unwrap().unwrap();
            if (s.controls.el) s.controls.el.remove();
            if (s.controls.next) s.controls.next.remove();
            if (s.controls.prev) s.controls.prev.remove();
            if (s.pagerEl) s.pagerEl.remove();
            e(".bx-caption", this).remove();
            if (s.controls.autoEl) s.controls.autoEl.remove();
            clearInterval(s.interval);
            if (s.settings.responsive) e(window).unbind("resize", U)
        };
        o.reloadSlider = function(e) {
            if (e != undefined) r = e;
            o.destroySlider();
            f()
        };
        f();
        return this
    }
})(jQuery)

$(document).ready(function() {
    $('.bxslider').bxSlider({
         slideWidth: 250,
			  infiniteLoop: false,
			  minSlides: 2,
			  maxSlides: 4,
			  slideMargin: 10,
			  pager: true,
			  nextText: "",
      			  prevText: "",
			  hideControlOnEnd: true,
			  adaptiveHeight: true
    });
});





//$j(function(){
//		  $j('.bxslider').bxSlider({
//			  slideWidth: 250,
//			  infiniteLoop: false,
//			  minSlides: 2,
//			  maxSlides: 4,
//			  slideMargin: 10,
//			  pager: true,
//			  nextText: "",
  //    			  prevText: "",
//			  hideControlOnEnd: true,
//			  adaptiveHeight: true
//		});
//	});
