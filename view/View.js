amd.define('src/framework-ui/view/View', [
    'src/framework-ui/component/Component',
    'src/framework-ui/configuration/Configuration',
    'src/framework-ui/util/Util',
    'src/dom-lib/DomLib',
    'text!src/framework-ui/view/template/template.html'], function(Component, Configuration, Util, $, template) {

    var config = {
        autoRender: true,
        rootEl: '<div/>',
        pointDataAttributeSuffix: 'point'
    };

    function getPointDataAttribute() {
        return Configuration.get('pointDataAttributeSuffix') || config.pointDataAttributeSuffix;
    }

    function getTemplateInfo(placeholders) {
        var info = {};
        var placeholder;
        for (var ph=0; ph<placeholders.length; ph++) {
            placeholder = placeholders[ph];
            var parts = placeholder.split('.', 2);
            if (parts.length > 1) {
                switch(parts[0]) {
                    case 'appConf':
                        info[placeholder] = this.getAppConfig(parts[1]);
                        break;
                    case 'conf':
                        info[placeholder] = this.getConfig(parts[1]);
                        break;
                    default:
                        break;
                }
            } else if (typeof this.model !== 'undefined') {
                info[placeholder] = this.model.get(placeholder);
            }
        }
        return info;
    }

    var View = Component.extend({

        initialize: function() {
            this.$ = $;
            this.$rootEl = $(this.options.rootEl || config.rootEl);
            if (this.options.className) {
                this.$rootEl.addClass(this.options.className);
            }

            this.keyMap = this.options.keyMap || {};

            if (this.options.model) {
                this.model = this.options.model;
            }

            if (this.options.events) {
                this.events = this.options.events;
            }

            if (this.options.domBindings) {
                this.domBindings = this.options.domBindings;
            }

            this.onInit();
            this.render();
            applyBindings.call(this);
            if (this.options.el) {
                var $domEl = $(this.options.el);
                $domEl.append(this.$rootEl);
            }
        },

        getPoints: function(point) {
              return this.$rootEl.find('[data-' + getPointDataAttribute() + '="' + point + '"]');
        },

        getFirstPoint: function(point) {
            return this.$rootEl.findFirst('[data-' + getPointDataAttribute() + '="' + point + '"]');
        },

        destroy: function() {
            this.super();
        },

        render: function() {
            this.preRender();
            var theTemplate = this.options.template || this.template || template;
            var startDelimiter = '{{',
                endDelimiter = '}}';
            this.$rootEl.html(Util.populateTemplate(theTemplate, getTemplateInfo.call(this, Util.getTemplatePlaceholders(theTemplate, startDelimiter, endDelimiter)), startDelimiter, endDelimiter));
            this.$rootEl = $(this.$rootEl.children().length > 0 ? this.$rootEl.children()[0] : this.$rootEl);
            this.postRender();
        },

        onInit: function() {}, // hook

        postRender: function() {}, // hook

        preRender: function() {} // hook

    });

    function applyAttributeBindings() {
        var bindings = this.$rootEl.find('[data-bind]');
        console.log('attr', bindings);
    }


    function applyBindings() {
        applyEvents.call(this);
        applyCustomBindings.call(this);
        applyTextBindings.call(this);
    }

    function applyEvents() {
        if (typeof this.events === 'undefined') {
            return;
        }
        var events = [];
        var eventKeys = Object.keys(this.events);
        for (var key=0; key<eventKeys.length; key++) {
            var pair = eventKeys[key].split(' ');
            applyEvent.call(this, pair[0], pair[1], this.events[eventKeys[key]]);
        }
    }

    function applyEvent(type, selector, callback) {
        var resultSet = this.$rootEl.find(selector);
        var that = this;
        for (var r=0; r<resultSet.length; r++) {
            $(resultSet[r])[type](function() {
                that[callback].call(that);
            });
        }
    }

    var applyCustomBindings = function() {
//        if (!this.domBindings) {
//            return;
//        }
//        var bindings = this.$rootEl.querySelectorAll('[data-lp-point]');
//        var that = this;
//        for (var b=0; b<bindings.length; b++) {
//            (function(binding) {
//                var point = binding.getAttribute('data-lp-point');
//                if (that.domBindings[point]) {
//                    that.domBindings[point].call(that, binding);
//                }
//            })(bindings[b]);
//        }
        //console.log(bindings);
    };

    function applyTextBindings() {
//        var bindings = this.$rootEl.querySelectorAll('[data-bind]');
//        var that = this;
//        for (var binding=0; binding<bindings.length; binding++) {
//            (function(binding) {
//                var attribute = bindings[binding].getAttribute('data-bind').substring('text:'.length);
//                var val = that.model.get(getKey.call(that, attribute));
//                if (typeof val !== 'undefined') {
//                    bindings[binding];
//                }
//                var setter = function(value) {
//                    bindings[binding].innerHTML = value || '';
//                };
//
//                setter(val);
//
//                that.model.on('change:' + getKey.call(that, attribute), setter);
//            })(binding);
//        }
    }

    function getKey(key) {
        return this.keyMap[key] || key;
    }

    return View;

});