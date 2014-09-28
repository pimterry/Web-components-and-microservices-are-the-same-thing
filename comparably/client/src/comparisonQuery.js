window.comparisonQuery = (function () {
    var comparisonQueryServer = "http://comparably-comparison-query.herokuapp.com";

    function returnXhrResult(callback) {
        return function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    callback(this.responseText || true, null);
                } else {
                    callback(null, JSON.parse(this.responseText));
                }
            }
        }
    }

    return {
        loadComparison: function (comparisonId, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = returnXhrResult(callback);

            xhr.open("GET", comparisonQueryServer + "/comparisons/" + comparisonId);
            xhr.send();
        },
        loadGuestComparisons: function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = returnXhrResult(callback);

            xhr.open("GET", comparisonQueryServer + "/comparisons/guest");
            xhr.send();
        },
        loadComparisonsForUser: function (user, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = returnXhrResult(callback);

            xhr.open("GET", comparisonQueryServer + "/comparisons/user/" + user.id() +
                                               "?token=" + user.token());
            xhr.send();
        }
    }
})();