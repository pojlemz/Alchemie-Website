function ViewModals(){

};

ViewModals.prototype.initialize = function(){

}

ViewModals.prototype.showModal = function(modalName){
    $("#fn-modal-overlay").show();
    var modal = $("."+modalName);
    modal.show();
}