function Mitarbeiter(mitarbeiter) {
    this.n1 = ko.observable(mitarbeiter.n1);
    this.d1 = ko.observable(mitarbeiter.d1);
    this.t1 = ko.observable(mitarbeiter.t1);
    this.t2 = ko.observable(mitarbeiter.t2);
    this.taetigkeit = ko.observable(mitarbeiter.taetigkeit);
}
function MitarbeiterViewModel() {
    var self = this;
    self.name = ko.observable();
    self.datumIn = ko.observable(new Date('2012/12/30'));
    self.time1 = ko.observable('00:00');
    self.time2 = ko.observable('00:00');
    self.t = ko.observable();

    //Options for select input
    self.alleTaetigkeiten = ko.observableArray( [
       { taetigkeitArt: 'Arbeit' },
       { taetigkeitArt: 'Pause' },
       { taetigkeitArt: 'Reisezeit' },
       { taetigkeitArt: 'Unproduktiv' }
    ]);
    self.alleMitarbeiter = ko.observableArray([]);

    //Remove
    self.removeMitarbeiter = function (mitarbeiter) {
        self.alleMitarbeiter.remove(mitarbeiter);}

    //Add
    self.addMitarbeiter = function () {
        self.alleMitarbeiter.push(new Mitarbeiter({
            n1: self.name(),
            d1: self.datumIn(),
            t1: self.time1(),
            t2: self.time2(),
            taetigkeit: self.t()
        }));
        self.name("");
        self.datumIn(new Date('2012/12/30'));
        self.time1('00:00');
        self.time2('00:00');  
    }    
}
//datePicker custom binding
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "changeDate", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(event.date);
            }
        });
    },
    update: function (element, valueAccessor) {
        var widget = $(element).data("datepicker");
        //when the view model is updated, update the widget
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            widget.setValue();
        }
    }
};

//SelectPicker custom binding
ko.bindingHandlers.selectPicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                } else {
                    // regular select and observable so call the default value binding
                    ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                }
            }
            $(element).addClass('selectpicker').selectpicker();
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
            if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                var options = selectPickerOptions.optionsArray,
                    optionsText = selectPickerOptions.optionsText,
                    optionsValue = selectPickerOptions.optionsValue,
                    optionsCaption = selectPickerOptions.optionsCaption,
                    isDisabled = selectPickerOptions.disabledCondition || false,
                    resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                if (ko.utils.unwrapObservable(options).length > 0) {
                    // call the default Knockout options binding
                    ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                }
                if (isDisabled && resetOnDisabled) {
                    // the dropdown is disabled and we need to reset it to its first option
                    $(element).selectpicker('val', $(element).children('option:first').val());
                }
                $(element).prop('disabled', isDisabled);
            }
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                } else {
                    // call the default Knockout value binding
                    ko.bindingHandlers.value.update(element, valueAccessor);
                }
            }

            $(element).selectpicker('refresh');
        }
    }
};




ko.applyBindings(new MitarbeiterViewModel());