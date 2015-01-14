lpTag.amd.define('src/framework-ui/util/Util', [], function() {

    function populateTemplate(html, object, startDelimiter, endDelimiter) {
        for (var key in object) {
            html = html.replace(startDelimiter + key + endDelimiter, object[key]);
        }
        return html;
    }

    function getTemplatePlaceholders(html, startDelimiter, endDelimiter) {
        var matches = html.match(new RegExp(startDelimiter + '.*?' + endDelimiter, 'g'));
        var resultSet = {};
        if (matches) {
            resultSet = matches.map(function (val) {
                return val.substring(startDelimiter.length, val.length - endDelimiter.length);
            });
        }
        return resultSet;
    }

    return {
        populateTemplate: populateTemplate,
        getTemplatePlaceholders: getTemplatePlaceholders
    };

});