function ControllerClick(){

};

ControllerClick.prototype.initialize = function(){
    var self = this;
    $('[clickcontroller]').click(function(event){
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('clickcontroller');
        self[fnName].apply(self, [event]); // This calls the function specified by controllerclick

    });
}

ControllerClick.prototype.addAddressToAccount = function(event){
    var addressToAddToAccount = $("#addressToAddToAccount").val();
    var url = g_App.getAjaxUrlPrefix() + "/add-owned-address-to-email?address="+addressToAddToAccount;
    //console.log(addressToAddToAccount);
    $.ajax(url).done(function(msg) { // Make API call to server to see if Address is taken
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
    });
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
    g_App.sendPostRequest('/forgotten-password', {}, 'get');
}

ControllerClick.prototype.newPassword = function(event){
    // First we check that the entered password is the same as the confirmed password.
    var firstPassword = $("#change-password-new-password").val();
    var secondPassword = $("#change-password-confirm-password").val();

    if (firstPassword === secondPassword){
        var email = $("#temporary-data-email").attr('value');
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
        // var email = $("#temporary-data-email").attr('value');
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