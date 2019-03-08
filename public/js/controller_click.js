function ControllerClick(){
    this._recoPrice = 0;
    this._addressToDelete = "";
    this._tokensToBuy = 0;
};

ControllerClick.prototype.initialize = function(){
    this.resetClickControllerForSelector(''); // This removes click event selectors from all elements with a clickcontroller attribute.
}

ControllerClick.prototype.resetClickControllerForSelector = function(selector){ // This is called when we want to add click events for various html elements.
    var self = this; // This makes it so that the 'this' variable is available inside the callback
    $(selector + ' [clickcontroller]').off('click'); // This removes click event selectors from the selected elements
    $(selector + ' [clickcontroller]').click(function(event){ // This adds click event selectors to the selected elements
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('clickcontroller'); // This gets the function name from the element with the clickcontroller attribute
        if (typeof(fnName) !== 'undefined') { // If the function name is defined (html element has attribute 'clickcontroller')
            self[fnName].apply(self, [event]); // This calls the function specified by controllerclick
        } else { // If the function name is not defined
            $(event.target).parent().click(); // This calls the click event on the parent element
        }
    });
}

ControllerClick.prototype.addAddressToAccount = function(event){ // This is called when the user clicks the button to add the address to the account
    var addressToAddToAccount = $("#addressToAddToAccount").val(); // This variable stores the address that the user types into the box
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server
    $.post("/add-owned-address-to-email", { address: addressToAddToAccount, _csrf: csrfToken}, function( msg ) { // This makes a post request to add the given address to the user's account
        // Try the following line of code in the Javascript console:
        // thirdparty.web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
        if (thirdparty.web3.utils.isAddress(addressToAddToAccount)) { // This checks that the address is a valid web3 address.
            // console.log(JSON.stringify(msg)); // This line of code produces a message like the following:
            // {"response":"failure","email":null,"address":null}
            if (msg.response === 'failure') { // If address is then report an error in the view.
                g_App.getViewAddressAdd().showErrorForTakenAddress(); // This shows the user an error saying that the address has been taken
            } else {
                // Add the address to the list in the UI
                g_App.getViewAddressAdd().addAddressToList(addressToAddToAccount); // This adds the address to the front end of the application
            }
        } else {
            g_App.getViewAddressAdd().showErrorForInvalidAddress(); // Tells the user that the address added is an invalid web3 address
        }
    }, "json"); // This states that the post request being made is made as a json request
}

ControllerClick.prototype.enable2FA = function(event){ // This triggers when the user clicks the button to enable 2FA
    var code2fa = $("#2faCode").val(); // This variable stores the 2FA code that the user has typed in.
    var secret2fa = thirdparty.base32.decode($("#2faSecret").text()); // This variable stores the 2FA secret code that has been generated.
    // This calls the 2fa backend with the entered code verifying that it is valid against the shared secret.
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
    // Now we make a post request which tests to see if the 2FA code and the shared secret match.
    $.post("/two-factor-bridge-verify-one-time-code-and-email-against-specific-shared-secret", {code: code2fa, sharedSecret: secret2fa, _csrf: csrfToken}, function(msg) {
        if (msg) { // If the code is valid against this shared secret:
            // We set the shared secret in the following API call
            $.post("/two-factor-bridge-set-shared-secret", {code: code2fa, sharedSecret: secret2fa, _csrf: csrfToken}, function( msg ) {
                if (msg) { // If msg is true (ie. shared secret has been successfully set)
                    // Shared secret has been successfully updated so carry out UI actions to notify user
                    g_App.sendPostRequest('/login-shared-secret-set', {}, 'get'); // We tell the user that the shared secret has been successfully set
                } else { // If msg is not true (which it shouldn't be because we already placed a check here)
                    // This should be unreachable code
                    console.error("Unable to set code for user because user probably already has a code."); // Prints an error message server side
                }
            }, "json"); // This states that the post request being made must be made as a json request
        } else {
            // If the code does not match the shared secret
            g_App.getViewUserMessages().showErrorForIncorrect2FASetupCode() // Shows a message to the user telling them that the code provided is incorrect.
        }
    }, "json"); // This states that the post request being made is made as a json request
}

ControllerClick.prototype.remove2FA = function(event){ // This is called when the user clicks the button to remove 2FA from their account
    // var urlAttemptable = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-is-2fa-attemptable";
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
    $.post("/two-factor-bridge-is-2fa-attemptable", {_csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) { // If the server tells us that 2FA is attemptable.
            var code2fa = $("#2faCode").val(); // This variable stores the 2FA code that the user types in.
            // @TODO: Add code here to see if 2FA is attemptable
            $.post( "/two-factor-bridge-delete-shared-secret", {code: code2fa, _csrf: csrfToken}, function (msg) { // This calls the backend with the entered code verifying that it is valid against the shared secret.
                if (msg) { // If the code was successfully deleted
                    // Shared secret has been successfully deleted so carry out UI actions to notify user
                    g_App.sendPostRequest('/login-shared-secret-removed', {}, 'get'); // Sends a get request removing the shared secret for this user
                } else { // If the code was not successfully deleted
                    // If the code does not match the shared secret then carry out UI actions to report that the code could not be deleted.
                    g_App.getViewUserMessages().showErrorForIncorrect2FARemovalCode(); // Show an error message saying that the code entered by the user is incorrect
                }
            }, "json"); // This states that the post request being made must be made as a json request
        } else {
            g_App.getViewUserMessages().showErrorForTooManyAttemptsAt2FACode(); // Shows the error stating that the server no longer accepts attempts at the right 2FA code
        }
    }, "json"); // This states that the post request being made is made as a json request
}

ControllerClick.prototype.forgotYourPassword = function(event){ // This is called when the user clicks 'Trouble Signing In'.
    // We are okay with this simply being a GET request because it just takes us to the forgotten password page.
    g_App.sendPostRequest('/forgotten-password', {}, 'get'); // This sends the post request to retrieve the page for users who have forgotten their password
}

ControllerClick.prototype.newPassword = function(event){ // This is called when the user clicks the button triggering the submission of a new password
    // First we check that the entered password is the same as the confirmed password.
    var firstPassword = $("#change-password-new-password").val(); // A variable that stores the password entered by the user in the first box
    var secondPassword = $("#change-password-confirm-password").val(); // A variable that stores the password entered by the user in the second input box
    if (firstPassword === secondPassword){ // If the first password equals the second password
        var email = $("#temporary-data-email").attr('associate'); // Set the email variable according to a value rendered in the UI from a previous request
        var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
        $.post("/two-factor-bridge-has-shared-secret-for-specific-email", {email: email, _csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
            if (msg) { // If the user with the specified email has a shared secret (2FA is enabled)
                $.post("/two-factor-bridge-is-2fa-attemptable-for-specific-email", {email: email, _csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
                    if (msg) { // This branch of code runs if the server sends a 'true' response for the query made in the post request.
                        // 2 factor is enabled and not blocked so prompt the user to enter their code.
                        g_App.getViewModals().showModal("fn-password-change-2fa-modal"); // This shows the modal that prompts the user for their 2FA code
                    } else {
                        // This code is run if the user has attempted to put a 2FA code in too many times.
                        g_App.getViewModals().showModal("fn-2fa-not-attemptable"); // This shows the modal that tells the user the number of available attempts have been exceeded.
                    }
                }, "json"); // This states that the post request being made must be made as a json request
            } else { // 2 factor is disabled so submit request to server.
                var passwordKey = $("#temporary-data-reset-password-link").val(); // Get the password key from the value that was rendered in the UI
                g_App.sendPostRequest('/submit-reset-password', {key: passwordKey, password: firstPassword}); // Submit a request to reset the password with key in url and new password
            }
        }, "json"); // This states that the post request being made is made as a json request
    } else {
        g_App.getViewUserMessages().showErrorForMismatchingPasswords(); // Display an error message letting the user know that their passwords don't match
    }
}

ControllerClick.prototype.twoFactorNewPassword = function(event){ // This is called when within the 2FA option, the user wishes to reset their password
    // First we check that the entered password is the same as the confirmed password.
    var firstPassword = $("#change-password-new-password").val(); // A variable that stores the password entered by the user in the first box
    var secondPassword = $("#change-password-confirm-password").val(); // A variable that stores the password entered by the user in the second input box
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
    if (firstPassword === secondPassword) { // If the first password equals the second password
        var email = $("#temporary-data-email").attr('associate'); // Set the email variable according to a value rendered in the UI from a previous request
        // // TODO: Check that password reset link is valid.
        // var urlHas2FA = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-has-shared-secret-for-specific-email?email="+email;
        // $.ajax(urlHas2FA).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        //     // TODO: Check that 2FA Code is valid
        //     if (msg) {
        var firstPassword = $("#change-password-new-password").val(); // A variable that stores the password entered by the user in the first box
        var passwordKey = $("#temporary-data-reset-password-link").attr('associate'); // A variable that stores the reset password link
        var code2fa = $("#change-password-2fa-input").val(); // A variable that stores the user 2FA input
        // 2 factor is disabled so submit request to server.
        $.post( "/two-factor-bridge-verify-one-time-code-and-email", {code: code2fa, email: email, _csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
            if (msg) { // if the one time code for this user's email is verified
                // This code executed when the user successfully enters their code.
                g_App.sendPostRequest('/submit-reset-password', {key: passwordKey, password: firstPassword, code2fa: code2fa}); // Send a post request to submit reset password
            } else {
                // This code is run when the code the user enters is incorrect
                g_App.getViewModals().showErrorMessageInModal("fn-password-change-2fa-modal", "The code you entered is incorrect."); // 1st argument is modal name, 2nd argument is message
            }
        }, "json"); // This states that the post request being made is made as a json request
    } else {
        // Display an error message letting the user know that their passwords don't match
        // This line of code should never be executed.
        g_App.getViewModals().showErrorMessageInModal("fn-password-change-2fa-modal", "Your passwords don't match."); // 1st argument is modal name, 2nd argument is message
    }
}

ControllerClick.prototype.closeModals = function(event){ // This is called when we want to close the modals that are open.
    $(".fn-modal").hide(); // Close the modal
    $("#fn-modal-overlay").hide(); // Hide the modal overlay
}

ControllerClick.prototype.fileRealSubmitButton = function(event){ // This is called when we want to submit the file uploaded to the server
    // $('.fn-file-real-submit-button').click(); // Trigger click event on file real submit button
    g_App.getViewModals().showModal("fn-validating");
    setTimeout(function() {
        // fn-validation-complete
        var urlValidate = g_App.getAjaxUrlPrefix() + "/validate-user";
        $.ajax(urlValidate).done(function(msg) {
            // $.post( "/two-factor-bridge-has-shared-secret", {_csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
            g_App.getViewModals().showModal("fn-validation-complete");
            setTimeout(function () {
                g_App.sendPostRequest('/browse-offers', {}, 'get');
            }, 2000);
        });
    }, 2000)
}

ControllerClick.prototype.fileRealUploadButton = function(event){ // This is called when we want to upload the file from the user's machine to the html form.
    $('.fn-file-real-upload-button').click(); // Trigger click event on file real upload button
}

ControllerClick.prototype.addWithdrawalAddress = function(event){ // This is called when we want to add a withdrawal address
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
    // First we check that the entered password is the same as the confirmed password.
    $.post( "/two-factor-bridge-has-shared-secret", {_csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) { // If the user has a shared secret (as depicted by the server).
            $.post("/two-factor-bridge-is-2fa-attemptable", {_csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
                if (msg) { // If 2FA is attemptable for user (number of attempts not exceeding limit)
                    // 2 factor is enabled and not blocked so prompt the user to enter their code.
                    g_App.getViewModals().showModal("fn-add-withdrawal-address-2fa-modal"); // Show modal that prompts user to enter their 2FA code
                } else { // If 2FA is not attemptable for user
                    // This code is run if the user has attempted to put a 2FA code in too many times.
                    g_App.getViewModals().showModal("fn-2fa-not-attemptable"); // Show the modal that states the user is not allowed any more 2FA attempts
                }
            }, "json"); // This states that the post request being made is made as a json request
        } else { // If the user does not have a shared secret (according to the server)
            // 2 factor is disabled so submit request to server.
            var address = $("#withdrawalAddressToAdd").val(); // Add the withdrawal address to the account
            var urlWithdrawalAddressAdd = g_App.getAjaxUrlPrefix() + "/withdrawal-address-add?address="+address; // Set variable to url used to withdraw funds
            $.ajax(urlWithdrawalAddressAdd).done(function(msg) { // Make ajax call to add withdrawal address
                g_App.getViewWithdrawalAddressAdd().handleAddWithdrawalMessage(msg); // Handle the addition of a withdrawal address
            });
        }
    }, "json"); // This states that the post request being made is made as a json request
}

ControllerClick.prototype.twoFactorAddWithdrawalAddress = function(event){ // This is called when we want to add a withdrawal address and 2FA is enabled.
    var self = this; // This makes it so that the 'this' variable is available inside the callback
    var code2fa = $("#add-withdrawal-address-2fa-input").val(); // A variable that stores the user 2FA input
    var csrfToken = $('#csrf').attr('associate'); // This variable stores the csrf token provided by the server.
    // 2 factor is disabled so submit request to server.
    $.post("/verify-one-time-code-and-email", {code: code2fa, _csrf: csrfToken}, function( msg ) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) { // If the users one time code for the provided email is verified.
            // This code executed when the user successfully enters their code.
            var address = $("#withdrawalAddressToAdd").val(); // Add the withdrawal address to the account
            var urlWithdrawalAddressAdd = g_App.getAjaxUrlPrefix() + "/withdrawal-address-add?code="+code2fa+"&address="+address; // Set variable to url used to withdraw funds
            $.ajax(urlWithdrawalAddressAdd).done(function(msg) { // Make ajax call to add withdrawal address
                g_App.getViewWithdrawalAddressAdd().handleAddWithdrawalMessage(msg); // Handle the addition of a withdrawal address
            });
        } else {
            // This code is run when the user unsuccessfully enters their code.
            g_App.getViewUserMessages().showErrorForIncorrect2FACode(); // This shows the error message telling the user that the 2FA code they entered is incorrect
        }
    }, "json"); // This states that the post request being made is made as a json request
}

ControllerClick.prototype.selectWithdrawalAddress = function(event) { // This is called
    var selectedAddressElement = $(event.target);
    $(".fn-withdrawal-address-main-text").removeClass("cssSelected");
    $(".fn-withdrawal-address-main-text").removeClass("fnSelected");
    $(selectedAddressElement).addClass("cssSelected");
    $(selectedAddressElement).addClass("fnSelected");
}

ControllerClick.prototype.deleteWithdrawalAddress = function(event){
    this._addressToDelete = $(event.target).attr("associate");
    g_App.getViewModals().showModal("fn-confirm-delete-withdrawal-address-modal");
}

ControllerClick.prototype.confirmDeleteWithdrawalAddress = function(event){
    var self = this;
    var url2FAIsValidCode = g_App.getAjaxUrlPrefix() + "/withdrawal-address-remove?address="+self._addressToDelete;
    $.ajax(url2FAIsValidCode).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) {
            $(".fn-withdrawal-address[associate=" + self._addressToDelete+"]").remove();
            self.closeModals();
        }
    });
}

ControllerClick.prototype.submitWithdrawal = function(event){
    // var self = this;
    var address = $(".fnSelected").attr('associate');
    var amount = $("#withdrawalAmount").val();

    // var url = g_App.getAjaxUrlPrefix() + "/submit-withdrawal";
    // $.ajax(url2FAIsValidCode).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
    //     if (msg) {
    //         $(".fn-withdrawal-address[associate=" + self._addressToDelete+"]").remove();
    //         self.closeModals();
    //     }
    // });
    var csrfToken = $('#csrf').attr('associate');
    $.post( "/submit-withdrawal", { address: address, amount: amount, _csrf: csrfToken}, function( data ) {
    }, "json");
}

ControllerClick.prototype.beginOrder = function(event){
    g_App.getViewProductPrices().copyCurrentPricesToLockedPrices();
    var productAddressSelected = $("#product-address-selected").text();
    var prices = g_App.getViewProductPrices().getLockedPrices();
    var quantities = {};
    var pricesAsDict = {};
    var quantityItems = $(".fnQty");
    for (var i = 0; i < quantityItems.length; i++){
        var productCode = $(quantityItems[i]).attr('associate');
        var productQuantity = parseInt($(quantityItems[i]).val());
        if (productQuantity > 0){
            quantities[productCode] = productQuantity;
        }
    }
    for (var i = 0; i < prices.length; i++){
        pricesAsDict[prices[i]['instrument']] = prices[i];
    }
    g_App.getViewProducts().populateProductListInModal(Object.keys(quantities));
    var csrfToken = $('#csrf').attr('associate');
    $.post("/begin-order-and-get-response", {productAddress: productAddressSelected, prices: JSON.stringify(pricesAsDict), quantities: JSON.stringify(quantities), _csrf: csrfToken}, function( data ) {
        console.log(data);
        // The following block of code fills the numerical parts of the modal
        var keys = Object.keys(quantities);
        var grandTotal = 0;
        for (var i = 0; i < keys.length; i++) {
            // keys example: ['1KILOG', '100G']
            var code = keys[i];
            var qty = parseInt(quantities[code]);
            var unitPrice = Number(pricesAsDict[code]['price']).toFixed(8);
            var total = Number(quantities[code] * pricesAsDict[code]['price']).toFixed(8);
            grandTotal += parseFloat(Number(quantities[code] * pricesAsDict[code]['price']).toFixed(8));
            $(".fn-order-total[associate='"+code+"']").text(total);
            $(".fn-order-qty[associate='"+code+"']").text(qty);
            $(".fn-order-unit-price[associate='"+code+"']").text(unitPrice);
        }
        $(".fn-final-cost").text(grandTotal.toFixed(8) + ' BTC');
        g_App.getViewModals().showModal("fn-confirm-place-order");
        // The following block of code appends the correct QR code to the modal that asks for payment.
        var depositAddress = data.depositAddress;
        var img = document.createElement("IMG");
        // https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:1MoLoCh1srp6jjQgPmwSf5Be5PU98NJHgx?amount=.01%26label=Moloch.net%26message=Donation
        // img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:"+depositAddress;
        img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:"+depositAddress+"?amount="+grandTotal.toFixed(8);
        $('#DillonGageQRCode').children().remove();
        $('#DillonGageQRCode').append(img);
    }, "json");
}

ControllerClick.prototype.confirmProductOrder = function(event){

}

// ControllerClick.prototype.showFinalOrder = function(event){
//     // Creates a lock token on the server
//     // Gets prices and metrics corresponding to the lock token
//     // Show the modal that lets you place an order on the locked prices (you have 20 seconds to place the order)
//     var postBody = {}; //{items:[{"code":"1KILOG","transactionType":"buy","qty":"10"},{"code":"1GP","transactionType":"buy","qty":"50"}]};
//     postBody['items'] = [];
//     var arrayOfQuantitiesEntered = $(".fnQty");
//     for (var i = 0; i < arrayOfQuantitiesEntered.length; i++){
//         var productCode = $(arrayOfQuantitiesEntered[i]).attr('associate');
//         var associate = parseInt($(arrayOfQuantitiesEntered[i]).val()).toFixed(0);
//         postBody['items'].push({code: productCode, "transactionType":"buy","qty":associate});
//     }
//     $.post("/lock-trades-and-get-response", {items: JSON.stringify(postBody['items'])}, function( data ) {
//         if (data.response === 'success'){
//             g_App.getViewUserMessages().removeMessagesFromUserAlertBox();
//             var values = data.values;
//             var finalCost = 0;
//             for (var i = 0; i < values.length; i++){
//                 var code = values[i]['product'];
//                 var unitPrice = values[i]['unitPriceBtc'];
//                 var qty = values[i]['qty'];
//                 var total = values[i]['totalPriceBtc'];
//                 $(".fn-order-total[value='"+code+"']").text(total.toFixed(8));
//                 $(".fn-order-qty[value='"+code+"']").text(qty);
//                 $(".fn-order-unit-price[value='"+code+"']").text(unitPrice.toFixed(8));
//                 finalCost += total;
//             }
//             $(".fn-final-cost").text(finalCost.toFixed(8) + ' BTC');
//             g_App.getViewModals().showModal("fn-confirm-place-order");
//         } else {
//             g_App.getViewUserMessages().showCustomErrorMessage("An error occurred while trying to process your order.");
//         }
//     }, "json");
// }

ControllerClick.prototype.selectProductAddress = function(event){
    var selectedAddressElement = $(event.target);
    $(".fn-product-address-main-text").removeClass("cssSelected");
    $(".fn-product-address-main-text").removeClass("fnSelected");
    $(selectedAddressElement).addClass("cssSelected");
    $(selectedAddressElement).addClass("fnSelected");
    // This next line closes the modals and sets the product address accordingly in the UI.
    $("#product-address-selected").text($(event.target).attr("associate"));
    this.closeModals();
    // g_App.getViewProductAddressAdd().showShowFinalOrderButton();
}

ControllerClick.prototype.deleteProductAddress = function(event){

}


ControllerClick.prototype.addProductAddressToAccount = function(event) {
    var addressToAddToAccount = $("#productAddressToAdd").val();
    // Try the following line of code in the Javascript console:
    // thirdparty.web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
    if (thirdparty.web3Utils.isAddress(addressToAddToAccount)) {
        var csrfToken = $('#csrf').attr('associate');
        $.post("/add-product-address-to-email", { address: addressToAddToAccount, _csrf: csrfToken}, function( msg ) {
            // console.log(JSON.stringify(msg)); // This line of code produces a message like the following:
            // {"response":"failure","email":null,"address":null}
            if (msg.response === 'failure') { // If address is then report an error in the view.
                g_App.getViewAddressAdd().showErrorForTakenAddress();
            } else {
                // Add the address to the list in the UI
                g_App.getViewProductAddressAdd().addAddressToList(addressToAddToAccount);
            }
        }, "json");
    } else {
        // TODO: Show the right error message here
        g_App.getViewAddressAdd().showErrorForInvalidAddress();
    }
}

ControllerClick.prototype.beginSelectProductAddress = function(event){
    g_App.getViewProductAddressAdd().hideShowFinalOrderButton();
    g_App.getViewProductAddressAdd().showListOfProductAddresses(function(msg){
        g_App.getViewModals().showModal('fn-select-a-gold-address');
    });
}

ControllerClick.prototype.buyOne = function(event){
    var quantities = {};
    quantities[$(event.target).attr("associate")] = 1;
    g_App.getViewProductPrices().copyCurrentPricesToLockedPrices();
    var productAddressSelected = $("#product-address-selected").text();
    var prices = g_App.getViewProductPrices().getLockedPrices();
    var pricesAsDict = {};
    // var quantities = {};
    // var quantityItems = $(".fnQty");
    // for (var i = 0; i < quantityItems.length; i++){
    //     var productCode = $(quantityItems[i]).attr('associate');
    //     var productQuantity = parseInt($(quantityItems[i]).val());
    //     if (productQuantity > 0){
    //         quantities[productCode] = productQuantity;
    //     }
    // }
    for (var i = 0; i < prices.length; i++){
        pricesAsDict[prices[i]['instrument']] = prices[i];
    }
    g_App.getViewProducts().populateProductListInModal(Object.keys(quantities));
    var csrfToken = $('#csrf').attr('associate');
    if (thirdparty.web3Utils.isAddress(productAddressSelected)) { // If the address selected by the user is a valid web3 address
        $.post("/begin-order-and-get-response", {
            productAddress: productAddressSelected,
            prices: JSON.stringify(pricesAsDict),
            quantities: JSON.stringify(quantities),
            _csrf: csrfToken
        }, function (data) {
            console.log(data);
            // The following block of code fills the numerical parts of the modal
            var keys = Object.keys(quantities);
            var grandTotal = 0;
            for (var i = 0; i < keys.length; i++) {
                // keys example: ['1KILOG', '100G']
                var code = keys[i];
                var qty = parseInt(quantities[code]);
                var unitPrice = Number(pricesAsDict[code]['price']).toFixed(8);
                var total = Number(quantities[code] * pricesAsDict[code]['price']).toFixed(8);
                grandTotal += parseFloat(Number(quantities[code] * pricesAsDict[code]['price']).toFixed(8));
                $(".fn-order-total[associate='" + code + "']").text(total);
                $(".fn-order-qty[associate='" + code + "']").text(qty);
                $(".fn-order-unit-price[associate='" + code + "']").text(unitPrice);
            }
            $(".fn-final-cost").text(grandTotal.toFixed(8) + ' BTC');
            g_App.getViewModals().showModal("fn-confirm-place-order");
            // The following block of code appends the correct QR code to the modal that asks for payment.
            var depositAddress = data.depositAddress;
            var img = document.createElement("IMG");
            // https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:1MoLoCh1srp6jjQgPmwSf5Be5PU98NJHgx?amount=.01%26label=Moloch.net%26message=Donation
            // img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:"+depositAddress;
            img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:" + depositAddress + "?amount=" + grandTotal.toFixed(8)
            $('#DillonGageQRCode').children().remove();
            $('#DillonGageQRCode').append(img);
        }, "json");
    } else { // If the address selected by the user is not a valid web3 address
        g_App.getViewUserMessages().showCustomErrorMessage("The address you entered is invalid.");
    }
}

ControllerClick.prototype.preparePaidEmail = function(event){
    var csrfToken = $('#csrf').attr('associate');
    $.post("/email-request", {content: "Strawbert", _csrf: csrfToken}, function( data ) {
        // fn-send-email-modal
        g_App.getViewModals().showModal("fn-send-email-modal");
        var depositAddress = data.depositAddress;
        var grandTotal = data.grandTotal;
        $(".fn-email-cost").text(grandTotal.toFixed(8) + ' BTC');
        $('.fn-email-coin-address').text(depositAddress);
        var img = document.createElement("IMG");
        // https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:1MoLoCh1srp6jjQgPmwSf5Be5PU98NJHgx?amount=.01%26label=Moloch.net%26message=Donation
        // img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:"+depositAddress;
        img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:" + depositAddress + "?amount=" + grandTotal.toFixed(8);
        $('#SendEmailQRCode').children().remove();
        $('#SendEmailQRCode').append(img);
        console.log(data);
        g_App.getWebSockets().startConnection(depositAddress);
        // Request a websocket connection and
    }, "json");
}

ControllerClick.prototype.investNowLicensingAgreement = function(event) { // This is called when we click the 'Invest Now' button
    g_App.getViewModals().showModal("fn-license-agreement-modal");
}

ControllerClick.prototype.agreeToTermsAndConditions = function(event) { // This is called when we click the 'Invest Now' button
    g_App.sendPostRequest('/web-wallet', {}, 'get'); // We tell the user that the shared secret has been successfully set
}

ControllerClick.prototype.fundNowButton = function(event){
    g_App.getViewModals().showModal("fn-deposit-modal");
}

ControllerClick.prototype.buyRECOWithBTCButton = function(event){
    var self = this;
    $.ajax('/get-btc-to-usd-conversion-rate').done(function(msg){
        var usdToToken = 10;
        var markup = 1.01;
        var buyRate = parseFloat(parseFloat((1 / msg.rate) * markup * usdToToken).toFixed(8));
        self._recoPrice = buyRate;
        $(".fn-reco-price-value").text(buyRate + ' BTC per RECO');
        var btcBalance = parseFloat($(".fn-display-btc-balance").text());
        var tokensToBuy = parseInt(btcBalance / buyRate);
        self._tokensToBuy = tokensToBuy;
        $(".fn-total-reco-amount").text(tokensToBuy);
        g_App.getViewModals().showModal("fn-purchase-reco-modal");
    });
}

ControllerClick.prototype.buyRECOtokensnow = function(event){
    var self = this;
    var quantity = parseInt($(".fn-total-reco-amount").text());
    var price = this._recoPrice;
    var urlOrderTokens = "/order-reco-tokens?quantity="+quantity+"&price="+price; // Set variable to url used to withdraw funds
    $.ajax(urlOrderTokens).done(function(msg) { // Make ajax call to add withdrawal address
        self.closeModals();
        var message = msg.msg;
        if (message === "Transaction complete"){
            console.log(message);
        }
        if (message === "The buying price requested is too low"){
            console.log(message);
        }
        if (message === "There are not enough funds in the account to cover the requested purchase"){
            console.log(message);
        }
    });
}

ControllerClick.prototype.goToDashboard = function(event) { // This is called when we click the 'Invest Now' button
    g_App.sendPostRequest('/dashboard', {}, 'get'); // We tell the user that the shared secret has been successfully set
}

ControllerClick.prototype.selectVoteOption = function(event) { // This is called when we click the 'Invest Now' button
    // Select appropriate items.
    $(event.target).parent().children().removeClass("css-vote-selection");
    $(event.target).addClass("css-vote-selection");
    var selectedOption = $(event.target).attr("associate");
    var pollid = $(event.target).parent().attr("associate");
    var urlSelectedOption = "/cast-vote?selection="+selectedOption+"&pollid="+pollid;
    $.ajax(urlSelectedOption).done(function(msg) {
        console.log("Update completed");
    });
    // g_App.sendPostRequest('/dashboard', {}, 'get'); // We tell the user that the shared secret has been successfully set
}

ControllerClick.prototype.goToWebWallet = function(event) { // This is called when we click the 'Invest Now' button
    g_App.sendPostRequest('/web-wallet', {}, 'get'); // We tell the user that the shared secret has been successfully set
}

ControllerClick.prototype.goToMessages = function(event) { // This is called when we click the 'Invest Now' button
    g_App.sendPostRequest('/poll', {}, 'get'); // We tell the user that the shared secret has been successfully set
}