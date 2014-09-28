window.comparisonQuery = (function () {
    var comparisonServer = "http://comparably-comparison-query.herokuapp.com";

    return {
        loadComparison: function (comparisonId, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status !== 200) {
                        callback(this.responseText || true, null);
                    } else {
                        callback(null, JSON.parse(this.responseText));
                    }
                }
            };

            xhr.open("GET", comparisonServer + "/comparisons/" + comparisonId);
            xhr.send();

            function error() {
                alert("Error loading comparison data");
            }
        }
    }
})();