window.ComparisonViewModel = (function () {
    var ComparisonViewModel = function ComparisonViewModel(data) {
        var self = this;
        self.id = ko.observable();

        data.items = data.items.map(function (item) {
            return new ItemViewModel(item, self.id);
        });

        ko.mapping.fromJS(data, {}, self);
    };

    ComparisonViewModel.prototype.addItem = function (item) {
        var newItem = new ItemViewModel({ }, this.id);

        comparisonCommand.createItem(newItem.name(), function (err, response) {
            if (err) {
                console.error(err);
                alert("Failed to create item");
            } else {
                newItem.id(response.id);
            }
        });

        this.items.push(newItem);
    };

    return ComparisonViewModel;
})();