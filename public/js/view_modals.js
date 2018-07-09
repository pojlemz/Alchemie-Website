function ViewModals(){

};

ViewModals.prototype.initialize = function(){

}

ViewModals.prototype.showModal = function(modalName){
    $("#fn-modal-overlay").show();
    var modal = $("."+modalName);
    modal.show();
}

// g_App.getViewModals().showErrorMessageInModal("fn-2fa-not-attemptable", "This is an error message");
ViewModals.prototype.showErrorMessageInModal = function(modalName, errorMessage){
    $("#fn-modal-overlay").show();
    var modal = $("."+modalName + ' .fn-modal-user-message-box');
    modal.empty();
    var html = '<div class="css-modal-user-message fn-modal-user-message">';
    html += errorMessage;
    html += '</div>';
    modal.append(html);
    // TODO: Set timeout to make error message disappear in 5 seconds.
}