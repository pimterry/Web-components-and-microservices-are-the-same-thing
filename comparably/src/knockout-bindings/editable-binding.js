(function() {
    const ENTER_KEY_CODE = 13;

    ko.bindingHandlers["editableText"] = {
        init: function (element, valueAccessor) {
            element.setAttribute("contentEditable", "true");

            element.addEventListener("blur", function () {
                var observable = valueAccessor();
                observable(element.textContent);
            });
            element.addEventListener("keydown", function (event) {
                if (event.keyCode === ENTER_KEY_CODE) {
                    event.preventDefault();
                    element.blur();
                }
            });
        },
        update: function (element, valueAccessor) {
            var observable = valueAccessor();
            element.textContent = observable();
        }
    }
})();