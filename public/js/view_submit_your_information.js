function ViewSubmitYourInformation(){

};

ViewSubmitYourInformation.prototype.initialize = function(){

}

ViewSubmitYourInformation.prototype.showErrorForIncorrect2FASetupCode  = function(){
    $(".fnOnlyOneError").remove();
    htmlMessage = '<div class="alert alert-danger fnOnlyOneError fnShowErrorForIncorrect2FASetupCode">The code you entered does not match the shared secret.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
}

ViewSubmitYourInformation.prototype.showErrorForIncorrect2FARemovalCode  = function(){
    $(".fnOnlyOneError").remove();
    htmlMessage = '<div class="alert alert-danger fnOnlyOneError fnShowErrorForIncorrect2FARemovalCode">The code you entered is invalid.</div>';
    $(".fnAlertBox").prepend(htmlMessage);
}

ViewSubmitYourInformation.prototype.showErrorForTooManyAttemptsAt2FACode = function(){
    $(".fnOnlyOneError").remove();
    htmlMessage = '<div class="alert alert-danger fnOnlyOneError fnShowErrorForTooManyAttemptsAt2FACode">You have exceeded the number of allowed two factor authentication attempts. Please try again Later. </div>';
    $(".fnAlertBox").prepend(htmlMessage);
}

ViewSubmitYourInformation.prototype.showErrorForMismatchingPasswords = function(){
    $(".fnOnlyOneError").remove();
    htmlMessage = '<div class="alert alert-danger fnOnlyOneError fnShowErrorForPasswordMismatch">The two passwords you typed in do not match. </div>';
    $(".fnAlertBox").prepend(htmlMessage);
}