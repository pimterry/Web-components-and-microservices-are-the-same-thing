window.ItemViewModel = (function () {
    var ItemFacetViewModel = (function () {
        function ItemFacetViewModel(itemFacet, itemId, comparisonId) {
            this.id = ko.observable();
            this.description = ko.observable("");
            itemFacet.score = itemFacet.score || 50;

            ko.mapping.fromJS(itemFacet, {}, this);

            this.itemId = itemId;
            this.comparisonId = comparisonId;

            this.description.subscribe(this.save, this);
            this.score.subscribe(this.save, this);
        };

        ItemFacetViewModel.prototype.save = function () {
            comparisonCommand.updateFacet(
                this.comparisonId(),
                this.id(),
                { description: this.description(), score: this.score() },
                function (err, response) {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        };

        return ItemFacetViewModel;
    })();

    var ItemViewModel = function ItemViewModel(item, comparisonId) {
        var self = this;
        self.id = ko.observable();

        item.name = item.name || "?";
        item.facets = (item.facets || []).map(function (facet) {
            return new ItemFacetViewModel(facet, self.id, comparisonId);
        });

        ko.mapping.fromJS(item, {}, self);

        self.comparisonId = comparisonId;
        self.name.subscribe(this.save, this);
    };

    ItemViewModel.prototype.addFacet = function () {
        var newFacet = new ItemFacetViewModel({ }, this.id, this.comparisonId);

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
    };

    ItemViewModel.prototype.save = function () {
        comparisonCommand.updateItem(
          this.id(),
          { name: this.name() },
          function (err, response) {
              if (err) {
                  console.error(err);
              }
          }
        );
    }

    return ItemViewModel;
})();