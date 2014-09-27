(function() {
    ko.bindingHandlers["twoWayAttr"] = {
        init: function (element, valueAccessor) {
            var config = valueAccessor();

            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    var observableForAttribute = config[mutation.attributeName];

                    if (observableForAttribute) {
                        observableForAttribute(element.getAttribute(mutation.attributeName));
                    }
                });
            }).observe(element, { attributes: true });
        },

        update: function (element, valueAccessor) {
            var config = valueAccessor();
            ko.utils.objectForEach(config, function (attrName, attrObservable) {
                var attrValue = attrObservable();

                if (attrValue === false || attrValue === null || attrValue === undefined) {
                    element.removeAttribute(attrName);
                } else {
                    element.setAttribute(attrName, attrValue.toString());
                }
            });
        }
    }
})();