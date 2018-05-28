function ControllerChange(){

};

ControllerChange.prototype.initialize = function(){
    this.resetChangeControllerForSelector('');
}

ControllerChange.prototype.resetChangeControllerForSelector = function(selector){
    var self = this;
    $(selector + ' [changecontroller]').off('input');
    $(selector + ' [changecontroller]').on('input',function(event){
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('changecontroller');
        if (typeof(fnName) !== 'undefined') {
            self[fnName].apply(self, [event]); // This calls the function specified by controllerclick
        } else {
            // $(event.target).parent().change(); // Add later with correct code if necessary
        }
    });
}

ControllerChange.prototype.inputKycFileChange = function(event){
    // console.log(event);
    var fileString = $(event.target).val();
    var fileStringArray = fileString.split("\\");
    var displayFilename = fileStringArray[fileStringArray.length - 1];
    // console.log(displayFilename);
    $(".fn-chosen-file-full-text").text(displayFilename);
}

ControllerChange.prototype.inputPurchaseQuantity = function(event){
    // console.log(event);
    g_App.getViewProductPrices().updateGrandTotal();
}