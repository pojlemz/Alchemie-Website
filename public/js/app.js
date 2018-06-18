function App(){
    this._ajaxUrlPrefix = $("#res-locals-host").val();
    this._controllerClick = new ControllerClick();
    this._controllerDrop = new ControllerDrop();
    this._controllerChange = new ControllerChange();
    this._viewAddressAdd = new ViewAddressAdd();
    this._viewUserMessages = new ViewUserMessages();
    this._viewModals = new ViewModals();
    this._viewWithdrawalAddressAdd = new ViewWithdrawalAddressAdd();
    this._viewProductPrices = new ViewProductPrices();
    this._viewProductAddressAdd = new ViewProductAddressAdd();
    this._viewProducts = new ViewProducts();
};

App.prototype.initialize = function(){
    this._controllerClick.initialize();
    this._viewAddressAdd.initialize();
    this._viewUserMessages.initialize();
    this._viewModals.initialize();
    this._controllerDrop.initialize();
    this._controllerChange.initialize();
    this._viewProductPrices.initialize();
    this._viewProductAddressAdd.initialize();
    this._viewProducts.initialize();

    // g_App.getViewAddressAdd().showListOfOwnedAddresses();
    $(document).ready(function() { // This disables default action in the captcha form so that it can be handled in Javascript.
        $('#password-reset-form').submit(function() {
            $(this).ajaxSubmit({
                error: function(xhr) {
                    status('Error: ' + xhr.status);
                },
                success: function(response) {
                    console.log(response);
                }
            });
            //Very important line, it disable the page refresh.
            return false;
        });
    });
    this.initializeDatepicker();

};

App.prototype.initializeDatepicker = function(){
    $("#dateofbirth").datepicker({});
}

App.prototype.getControllerClick = function(){
    return this._controllerClick;
}

App.prototype.getControllerChange = function(){
    return this._controllerChange;
}

App.prototype.getViewAddressAdd = function(){
    return this._viewAddressAdd;
}

App.prototype.getAjaxUrlPrefix = function(){
    return this._ajaxUrlPrefix;
}

// g_App.sendPostRequest('/login', {name: 'Johnny Bravo'});
// g_App.sendPostRequest('/login', {name: 'Johnny Bravo'}, 'get');
App.prototype.sendPostRequest = function(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("associate", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

App.prototype.getViewUserMessages = function(){
    return this._viewUserMessages;
}

App.prototype.getViewModals = function(){
    return this._viewModals;
}

App.prototype.getViewWithdrawalAddressAdd = function(){
    return this._viewWithdrawalAddressAdd;
}

App.prototype.getViewProductPrices = function(){
    return this._viewProductPrices;
}

App.prototype.getViewProductAddressAdd = function(){
    return this._viewProductAddressAdd;
}

App.prototype.getViewProducts = function(){
    return this._viewProducts;
}