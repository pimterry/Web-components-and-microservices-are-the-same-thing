window.UserViewModel = (function () {
    var UserViewModel = function UserViewModel(user) {
        this.comparisons = ko.observableArray();
        ko.mapping.fromJS(user, {}, this);

        this.loadComparisons();
    };

    UserViewModel.prototype.loadComparisons = function loadComparisons() {
        var self = this;
        comparisonQuery.loadComparisonsForUser(this, function (err, comparisons) {
            if (err) {
                alert(err);
            } else {
                self.comparisons(comparisons);
            }
        });
    };

    return UserViewModel;
})();

window.GuestUserViewModel = (function () {
    var GuestUserViewModel = function GuestUserViewModel() {
        this.comparisons = ko.observable();
    };
    return GuestUserViewModel;
})();