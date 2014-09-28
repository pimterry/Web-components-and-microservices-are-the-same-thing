window.UserViewModel = (function () {
    var UserViewModel = function UserViewModel(user, loadingObservable) {
        this.loading = loadingObservable;
        this.comparisons = ko.observableArray();
        ko.mapping.fromJS(user, {}, this);

        this.loadComparisons();
    };

    UserViewModel.prototype.loadComparisons = function loadComparisons() {
        var self = this;

        self.loading(self.loading() + 1);
        comparisonQuery.loadComparisonsForUser(this, function (err, comparisons) {
            if (err) {
                alert(err);
            } else {
                self.comparisons(comparisons);
                self.loading(self.loading() - 1);
            }
        });
    };

    return UserViewModel;
})();

window.GuestUserViewModel = (function () {
    var GuestUserViewModel = function GuestUserViewModel(loadingObservable) {
        this.loading = loadingObservable;
        this.comparisons = ko.observableArray();
        this.loadComparisons();
    };

    GuestUserViewModel.prototype.loadComparisons = function loadComparisons() {
        var self = this;

        self.loading(self.loading() + 1);
        comparisonQuery.loadGuestComparisons(function (err, comparisons) {
            if (err) {
                alert(err);
            } else {
                self.comparisons(comparisons);
                self.loading(self.loading() - 1);
            }
        });
    };

    return GuestUserViewModel;
})();