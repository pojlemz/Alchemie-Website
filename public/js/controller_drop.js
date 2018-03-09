function ControllerDrop(){

};

ControllerDrop.prototype.initialize = function(){
    this.initializeIdentificationDropper();
};

ControllerDrop.prototype.initializeIdentificationDropper = function(event){
    var droppedFiles = false;
    $('#drop-kyc-info').on('drop dragdrop',function(event){
        alert('dropped');
        // Show a message stating that an image has been uploaded
        event.preventDefault();
    });
    $('#drop-kyc-info').on('dragenter', function(event){
        event.preventDefault();
        $(this).html('drop now').css('background','blue');
    });
    $('#drop-kyc-info').on('dragleave', function(){
        $(this).html('drop here').css('background','red');
    });
    $('#drop-kyc-info').on('dragover', function(event){
        event.preventDefault();
    });
};