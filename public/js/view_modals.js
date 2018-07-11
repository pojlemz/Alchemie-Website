function ViewModals(){

};

ViewModals.prototype.initialize = function(){

}

ViewModals.prototype.showModal = function(modalName){
    $("#fn-modal-overlay").show();
    $(".fn-modal-user-message-box").empty();
    var modal = $("." + modalName);
    modal.show();
}

// g_App.getViewModals().showErrorMessageInModal("fn-2fa-not-attemptable", "This is an error message");
ViewModals.prototype.showErrorMessageInModal = function(modalName, errorMessage){
    $("#fn-modal-overlay").show();
    var messageBox = $("." + modalName + ' .fn-modal-user-message-box');
    messageBox.empty();
    var html = '<div class="css-modal-user-message fn-modal-user-message">';
    html += errorMessage;
    html += '</div>';
    messageBox.append(html);
    setTimeout(function() {
        messageBox.children().slideUp();
    }, 5000);
    // TODO: Set timeout to make error message disappear in 5 seconds.
}