window.ItemViewModel = (function () {
    var ItemFacetViewModel = (function () {
        function ItemFacetViewModel(itemFacet) {
            this.description = ko.observable();
            itemFacet.score = itemFacet.score || 50;
            ko.mapping.fromJS(itemFacet, {}, this);
        }

        return ItemFacetViewModel;
    })();

    var ItemViewModel = function ItemViewModel(item) {
        item.name = item.name || "?";
        item.facets = (item.facets || []).map(function (facet) {
            return new ItemFacetViewModel(facet);
        });
        ko.mapping.fromJS(item, {}, this);
    };

    ItemViewModel.prototype.addFacet = function (facet) {
        this.facets.push(new ItemFacetViewModel(facet));
    }

    return ItemViewModel;
})();