amd.define('src/framework-ui/component/Component', [
    'src/framework-ui/configuration/Configuration'
], function(Configuration) {

    /** private functions */

    function extendWith() {
        var theClass = this.prototype;
        for (var arg=0; arg<arguments.length; arg++) {

            for (var prop in theClass) {
                newClass.prototype[prop] = theClass[prop];
            }
            for (prop in extendingObject) {
                newClass.prototype[prop] = extendingObject[prop] || theClass[prop];
            }
        }

    }

	var Component = function(options) {
		this.options = options || {};
        this.config = this.options.config || {};
		this.__components = {};
	};

    /**
     * Returns configuration item passed to component instance
     * @param key
     * @returns {*}
     */
    Component.prototype.getConfig = function(key) {
        if (typeof key !== 'undefined') {
            return this.options.config[key];
        }
        return this.options.config;
    };

    /** end of private functions */

    /**
     * Returns application configuration item
     * @param key
     * @returns {*}
     */
    Component.prototype.getAppConfig = function(key) {
        return Configuration.get(key);
    };

	Component.prototype.create = function(component) {
		this.__components[component.id] = component;
	};

	Component.prototype.destroy = function() {
        console.log('base destroy');
		for (var c in this.components) {
			this.__components[c].destroy();
			delete this.__components[c];
		}
	};

    /**
     * Calls a super class corresponding method according to caller function name
     * @returns {*}
     */
    Component.prototype.super = function() {
        var callerFunctionName;
        for (var attr in this) {
            if (this[attr] == arguments.callee.caller) {
                callerFunctionName = attr;
            }
        }
        if (this.__super && this.__super[callerFunctionName]) {
            return this.__super[callerFunctionName].apply(this, arguments[0]);
        }
    }

    /**
     * Returns an extended function of component
     * @returns {newClass}
     */
    Component.extend = function () {
        var theClass = this.prototype;

        function newClass(options) {
            this.__super = theClass;
            Component.call(this, options);
            if (this.initialize) {
                this.initialize(options);
            }
        }

        for (var prop in theClass) {
            newClass.prototype[prop] = theClass[prop];
        }

        var extendingObjects = arguments;
        var extObj;
        for (var eoi=0; eoi<extendingObjects.length; eoi++) {
            extObj = extendingObjects[eoi];
            extObj = extObj.prototype ? extObj.prototype : extObj;
            for (prop in extObj) {
                newClass.prototype[prop] = extObj[prop] || theClass[prop];
            }
        }

        newClass.extend = Component.extend;
        return newClass;
    };

	return Component;

});