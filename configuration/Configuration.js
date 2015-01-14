lpTag.amd.define('src/framework-ui/configuration/Configuration', [], function() {

    var data = {};

    function load(myData) {
        data = myData;
    }

    function get(key) {
        if (typeof key !== 'undefined') {
            return data[key];
        }
        return data;
    }

    return {
        get: get,
        load: load
    };

});