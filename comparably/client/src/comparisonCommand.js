window.ComparisonCommand = (function () {
    var comparisonCommandServer = "http://comparably-comparison-command.herokuapp.com";

    function returnXhrResult(callback) {
        return function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    callback(this.responseText || true, null);
                } else {
                    var data = JSON.parse(this.responseText);
                    var error = data.success !== true;
                    callback(error, data);
                }
            }
        }
    }

    return function (user) {
        return {
            createItem: function (itemData, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = returnXhrResult(callback);

                xhr.open("POST", comparisonCommandServer + "/items");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(itemData));
            },
            updateItem: function (id, itemData, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = returnXhrResult(callback);

                xhr.open("PUT", comparisonCommandServer + "/items/" + id);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(itemData));
            },
            createFacet: function (comparisonId, itemId, facetData, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = returnXhrResult(callback);

                var path = "/comparisons/" + comparisonId + "/items/" + itemId + "/facets" +
                           "?token=" + user().token();

                xhr.open("POST", comparisonCommandServer + path);

                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(facetData));
            },
            updateFacet: function (comparisonId, facetId, facetData, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = returnXhrResult(callback);

                var path = "/comparisons/" + comparisonId + "/facets/" + facetId +
                           "?token=" + user().token();
                xhr.open("PUT", comparisonCommandServer + path);

                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(facetData));
            }
        }
    };
})();