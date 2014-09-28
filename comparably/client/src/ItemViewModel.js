window.ItemViewModel = (function () {
    var ItemFacetViewModel = (function () {
        function ItemFacetViewModel(itemFacet, itemId) {
            this.id = ko.observable();
            this.description = ko.observable("");
            itemFacet.score = itemFacet.score || 50;

            ko.mapping.fromJS(itemFacet, {}, this);

            this.itemId = itemId;
        }

        return ItemFacetViewModel;
    })();

    var ItemViewModel = function ItemViewModel(item, comparisonId) {
        this.id = ko.observable();

        item.name = item.name || "?";
        item.facets = (item.facets || []).map(function (facet) {
            return new ItemFacetViewModel(facet);
        });

        ko.mapping.fromJS(item, {}, this);

        this.comparisonId = comparisonId;
    };

    ItemViewModel.prototype.addFacet = function (facet) {
        var newFacet = new ItemFacetViewModel(facet);

        comparisonCommand.createFacet(
            this.comparisonId(),
            this.id(),
            { description: newFacet.description(), score: newFacet.score() },
            function (err, response) {
                if (err) {
                    console.error(err);
                    alert("Failed to create facet");
                } else {
                    // Obviously there's a race condition here. As ever, demo code.
                    newFacet.id(response.id);
                }
            }
        );

        this.facets.push(newFacet);
    }

    return ItemViewModel;
})();