function ControllerClick(){
    this._addressToDelete = "";
};

ControllerClick.prototype.initialize = function(){
    this.resetClickControllerForSelector('');
}

ControllerClick.prototype.resetClickControllerForSelector = function(selector){
    var self = this;
    $(selector + ' [clickcontroller]').off('click');
    $(selector + ' [clickcontroller]').click(function(event){
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('clickcontroller');
        if (typeof(fnName) !== 'undefined') {
            self[fnName].apply(self, [event]); // This calls the function specified by controllerclick
        } else {
            $(event.target).parent().click();
        }
    });
}

ControllerClick.prototype.addAddressToAccount = function(event){
    var addressToAddToAccount = $("#addressToAddToAccount").val();
    $.post("/add-owned-address-to-email", { address: addressToAddToAccount}, function( msg ) {
        // Try the following line of code in the Javascript console:
        // thirdparty.web3.utils.isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d');
        if (thirdparty.web3.utils.isAddress(addressToAddToAccount)) {
            // console.log(JSON.stringify(msg)); // This line of code produces a message like the following:
            // {"response":"failure","email":null,"address":null}
            if (msg.response === 'failure') { // If address is then report an error in the view.
                g_App.getViewAddressAdd().showErrorForTakenAddress();
            } else {
                // Add the address to the list in the UI
                g_App.getViewAddressAdd().addAddressToList(addressToAddToAccount);
            }
        } else {
            g_App.getViewAddressAdd().showErrorForInvalidAddress();
        }
    }, "json");
}

ControllerClick.prototype.enable2FA = function(event){
    var code2fa = $("#2faCode").val();
    var secret2fa = thirdparty.base32.decode($("#2faSecret").text());
    var url = g_App.getAjaxUrlPrefix() + "/verify-one-time-code-and-email-against-specific-shared-secret?code="+code2fa+"&sharedSecret="+secret2fa;
    $.ajax(url).done(function(msg) { // This calls the 2fa backend with the entered code verifying that it is valid against the shared secret.
        if (msg) { // If the code is valid against this shared secret:
            var url2 = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-set-shared-secret?code="+code2fa+"&sharedSecret="+secret2fa;
            $.ajax(url2).done(function(msg) { // This sets the shared secret
                if (msg) {
                    // Shared secret has been successfully updated so carry out UI actions to notify user
                    g_App.sendPostRequest('/login-shared-secret-set', {}, 'get');
                } else {
                    // This should be unreachable code
                    console.error("Unable to set code for user because user probably already has a code.");
                }
            });
        } else {
            // If the code does not match the shared secret
            g_App.getViewUserMessages().showErrorForIncorrect2FASetupCode()
        }
    });
}

ControllerClick.prototype.remove2FA = function(event){
    var urlAttemptable = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-is-2fa-attemptable";
    $.ajax(urlAttemptable).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) {
            var code2fa = $("#2faCode").val();
            var url = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-delete-shared-secret?code=" + code2fa;
            // @TODO: Add code here to see if 2FA is attemptable
            $.ajax(url).done(function (msg) { // This calls the backend with the entered code verifying that it is valid against the shared secret.
                if (msg) { // If the code was successfully deleted
                    // Shared secret has been successfully deleted so carry out UI actions to notify user
                    g_App.sendPostRequest('/login-shared-secret-removed', {}, 'get');
                } else {
                    // If the code does not match the shared secret then carry out UI actions to report that the code could not be deleted.
                    g_App.getViewUserMessages().showErrorForIncorrect2FARemovalCode();
                }
            });
        } else {
            g_App.getViewUserMessages().showErrorForTooManyAttemptsAt2FACode();
        }
    });
}

ControllerClick.prototype.forgotYourPassword = function(event){
    // We are okay with this simply being a GET request because it just takes us to the forgotten password page.
    g_App.sendPostRequest('/forgotten-password', {}, 'get');
}

ControllerClick.prototype.newPassword = function(event){
    // First we check that the entered password is the same as the confirmed password.
    var firstPassword = $("#change-password-new-password").val();
    var secondPassword = $("#change-password-confirm-password").val();

    if (firstPassword === secondPassword){
        var email = $("#temporary-data-email").attr('associate');
        var urlHas2FA = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-has-shared-secret-for-specific-email?email="+email;
        $.ajax(urlHas2FA).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
            if (msg) {
                var url2FAIsAttemptable = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-is-2fa-attemptable-for-specific-email?email="+email;
                $.ajax(url2FAIsAttemptable).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
                    if (msg) {
                        // 2 factor is enabled and not blocked so prompt the user to enter their code.
                        g_App.getViewModals().showModal("fn-password-change-2fa-modal");
                    } else {
                        // This code is run if the user has attempted to put a 2FA code in too many times.
                        g_App.getViewModals().showModal("fn-2fa-not-attemptable");
                    }
                });
            } else {
                var passwordKey = $("#temporary-data-reset-password-link").val();
                // 2 factor is disabled so submit request to server.
                g_App.sendPostRequest('/submit-reset-password', {key: passwordKey, password: firstPassword});
            }
        });
    } else {
        // Display an error message letting the user know that their passwords don't match
        g_App.getViewUserMessages().showErrorForMismatchingPasswords();
    }
}

ControllerClick.prototype.twoFactorNewPassword = function(event){
    // First we check that the entered password is the same as the confirmed password.
    var firstPassword = $("#change-password-new-password").val();
    var secondPassword = $("#change-password-confirm-password").val();

    if (firstPassword === secondPassword){
        // var email = $("#temporary-data-email").attr('associate');
        // // TODO: Check that password reset link is valid.
        // var urlHas2FA = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-has-shared-secret-for-specific-email?email="+email;
        // $.ajax(urlHas2FA).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        //     // TODO: Check that 2FA Code is valid
        //     if (msg) {
        var firstPassword = $("#change-password-new-password").val();
        var passwordKey = $("#temporary-data-reset-password-link").val();
        var code2fa = $("#change-password-2fa-input").val();
        // 2 factor is disabled so submit request to server.
        var url2FAIsValidCode = g_App.getAjaxUrlPrefix() + "/verify-one-time-code-and-email?code="+code2fa;
        $.ajax(url2FAIsValidCode).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
            if (msg) {
                // This code executed when the user successfully enters their code.
                g_App.sendPostRequest('/submit-reset-password', {key: passwordKey, password: firstPassword, code2fa: code2fa});
            } else {
                // This code is run when the user successfully enters their code.
                g_App.getViewModals().showErrorForIncorrect2FACode("fn-2fa-not-attemptable");
            }
        });
        //     } else {
        //         // 2 factor is disabled so submit request to server.
        //         g_App.sendPostRequest('/submit-reset-password', {key: passwordKey, password: firstPassword});
        //     }
        // });
    } else {
        // Display an error message letting the user know that their passwords don't match
        // This line of code should never be executed.
        g_App.getViewUserMessages().showErrorForMismatchingPasswords();
    }
}

ControllerClick.prototype.closeModals = function(event){
    $(".fn-modal").hide();
    $("#fn-modal-overlay").hide();
}

ControllerClick.prototype.fileRealSubmitButton = function(event){
    $('.fn-file-real-submit-button').click();
}

ControllerClick.prototype.fileRealUploadButton = function(event){
    $('.fn-file-real-upload-button').click();
}

ControllerClick.prototype.addWithdrawalAddress = function(event){
    // First we check that the entered password is the same as the confirmed password.
    var urlHas2FA = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-has-shared-secret";
    $.ajax(urlHas2FA).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) {
            var url2FAIsAttemptable = g_App.getAjaxUrlPrefix() + "/two-factor-bridge-is-2fa-attemptable";
            $.ajax(url2FAIsAttemptable).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
                if (msg) {
                    // 2 factor is enabled and not blocked so prompt the user to enter their code.
                    g_App.getViewModals().showModal("fn-add-withdrawal-address-2fa-modal");
                } else {
                    // This code is run if the user has attempted to put a 2FA code in too many times.
                    g_App.getViewModals().showModal("fn-2fa-not-attemptable");
                }
            });
        } else {
            // 2 factor is disabled so submit request to server.
            var address = $("#withdrawalAddressToAdd").val();
            var urlWithdrawalAddressAdd = g_App.getAjaxUrlPrefix() + "/withdrawal-address-add?address="+address;
            $.ajax(urlWithdrawalAddressAdd).done(function(msg) {
                g_App.getViewWithdrawalAddressAdd().handleAddWithdrawalMessage(msg);
            });
        }
    });
}

ControllerClick.prototype.twoFactorAddWithdrawalAddress = function(event){
    var self = this;
    var code2fa = $("#add-withdrawal-address-2fa-input").val();
    // 2 factor is disabled so submit request to server.
    var url2FAIsValidCode = g_App.getAjaxUrlPrefix() + "/verify-one-time-code-and-email?code="+code2fa;
    $.ajax(url2FAIsValidCode).done(function(msg) { // This calls the backend ensuring that the user is permitted to enter the 2fa code.
        if (msg) {
            // This code executed when the user successfully enters their code.
            var address = $("#withdrawalAddressToAdd").val();
            var urlWithdrawalAddressAdd = g_App.getAjaxUrlPrefix() + "/withdrawal-address-add?code="+code2fa+"&address="+address;
            $.ajax(urlWithdrawalAddressAdd).done(function(msg) {
                g_App.getViewWithdrawalAddressAdd().handleAddWithdrawalMessage(msg);
            });
        } else {
            // This code is run when the user unsuccessfully enters their code.
            g_App.getViewUserMessages().showErrorForIncorrect2FACode("fn-2fa-not-attemptable");
        }
    });
}

ControllerClick.prototype.selectWithdrawalAddress = function(event){
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
    $.post( "/submit-withdrawal", { address: address, amount: amount }, function( data ) {
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
    $.post("/begin-order-and-get-response", {productAddress: productAddressSelected, prices: JSON.stringify(pricesAsDict), quantities: JSON.stringify(quantities)}, function( data ) {
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
        img.src = "https://chart.googleapis.com/chart?chs=250x250&chld=L|2&cht=qr&chl=bitcoin:"+depositAddress+"?amount="+grandTotal.toFixed(8)
        $('#DillonGageQRCode').children().remove();
        $('#DillonGageQRCode').append(img);
    });
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
        $.post("/add-product-address-to-email", { address: addressToAddToAccount}, function( msg ) {
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