function ViewModals(){

};

ViewModals.prototype.initialize = function(){

}

ViewModals.prototype.showErrorForTakenAddress  = function(){
    // $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
    // htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">This address is already taken.</div>';
    // $(".fnAlertBox").prepend(htmlMessage);
    // Make API call to server to see if Address is taken
    // If address is not taken then add address to user's owned addresses and return positive result
    // If address is taken then report an error in the ajax call
}

ViewModals.prototype.showModal = function(modalName){
    $("#fn-modal-overlay").show();
    var modal = $("."+modalName);
    modal.show();
}