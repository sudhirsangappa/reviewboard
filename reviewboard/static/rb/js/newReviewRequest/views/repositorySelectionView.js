/*
 * A view for selecting a repository from a collection.
 */
RB.RepositorySelectionView = RB.CollectionView.extend({
    className: 'repository-selector',
    itemViewType: RB.RepositoryView,

    events: {
        'click .repository-search-icon': '_onSearchClicked',
        'input .repository-search': '_onSearchChanged'
    },

    /*
     * Initialize the view.
     */
    initialize: function() {
        _.super(this).initialize.apply(this, arguments);

        this._selected = null;
        this._searchActive = false;

        this.listenTo(this.collection, 'selected', this._onRepositorySelected);
    },

    /*
     * Render the view.
     */
    render: function() {
        _.super(this).render.apply(this, arguments);

        this._$header = $('<h3>')
            .text(gettext('Repositories'))
            .prependTo(this.$el);

        this._$searchIconWrapper = $('<div/>')
            .addClass('search-icon-wrapper')
            .prependTo(this.$el);

        this._$searchIcon = $('<div/>')
            .addClass('rb-icon rb-icon-search repository-search-icon')
            .prependTo(this._$searchIconWrapper);

        this._$searchBox = $('<input/>')
            .addClass('repository-search')
            .prependTo(this.$el);

        return this;
    },

    /*
     * Callback for when an individual repository is selected.
     *
     * Ensures that the selected repository has the 'selected' class applied
     * (and no others do), and triggers the 'selected' event on the view.
     */
    _onRepositorySelected: function(item) {
        this._selected = item;

        _.each(this.views, function(view) {
            if (view.model === item) {
                view.$el.addClass('selected');
            } else {
                view.$el.removeClass('selected');
            }
        });

        this.trigger('selected', item);
    },

    /*
     * Callback for when the search icon is clicked.
     *
     * Toggles on/off the search bar.
     */
    _onSearchClicked: function() {
        var parentWidth = this.$el.width(),
            iconWidth = this._$searchIconWrapper.outerWidth(true),
            iconOffset = parentWidth - iconWidth,
            $searchBox = this._$searchBox,
            searchBoxRightEdge = ($searchBox.position().left + $searchBox.width()),
            searchBoxRightMargin = parentWidth - searchBoxRightEdge,
            animationSpeedMS = 200;

        this._searchActive = !this._searchActive;

        if (this._searchActive) {
            this._$searchIconWrapper.animate({
                right: iconOffset
            }, animationSpeedMS);
            this._$searchBox
                .css('visibility', 'visible')
                .animate({
                    width: parentWidth - iconWidth - searchBoxRightMargin
                }, {
                    duration: animationSpeedMS,
                    complete: function() {
                        $searchBox.focus();
                    }
                });
        } else {
            this._$searchIconWrapper.animate({
                right: 0
            }, animationSpeedMS);
            this._$searchBox.animate({
                width: 0
            }, {
                duration: animationSpeedMS,
                complete: function() {
                    $searchBox.css('visibility', 'hidden');
                }
            });
        }
    },

    /*
     * Callback for when the text in the search input changes.
     *
     * Filters the visible items.
     */
    _onSearchChanged: function() {
        var searchTerm = this._$searchBox.val().toLowerCase();

        _.each(this.views, function(view) {
            view.$el.setVisible(view.lowerName.indexOf(searchTerm) !== -1);
        });
    }
});
