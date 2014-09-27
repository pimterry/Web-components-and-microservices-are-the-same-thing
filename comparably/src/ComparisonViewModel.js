window.ComparisonViewModel = (function () {
    var ComparisonViewModel = function ComparisonViewModel(data) {
        data.items = data.items.map(function (item) {
            return new ItemViewModel(item);
        });
        ko.mapping.fromJS(data, {}, this);
    };

    ComparisonViewModel.prototype.addItem = function (item) {
        this.items.push(new ItemViewModel({}));
    };

    return ComparisonViewModel;
})();