function ControllerChange(){

};

ControllerChange.prototype.initialize = function(){
    this.resetChangeControllerForSelector(''); // This enables event listeners on all html elements with a changecontroller attribute.
}

ControllerChange.prototype.resetChangeControllerForSelector = function(selector){
    var self = this; // Makes 'this' available as 'self' inside callback
    $(selector + ' [changecontroller]').off('input'); // Removes event listeners for changecontroller under given selector
    $(selector + ' [changecontroller]').on('input',function(event){ // Adds event listener every time selected elements are changed
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('changecontroller'); // Sets the fnName variable to the value of the changecontroller attribute.
        if (typeof(fnName) !== 'undefined') { // If the function name is defined/exists then enter this 'if' statement
            self[fnName].apply(self, [event]); // This calls the function specified by changecontroller
        } else {
            // $(event.target).parent().change(); // Add later with correct code if necessary
        }
    });
}

ControllerChange.prototype.inputKycFileChange = function(event){
    // console.log(event);
    var fileString = $(event.target).val(); // This gets the filename of the image that the user wants to upload
    var fileStringArray = fileString.split("\\"); // This sends the filestring to an array
    var displayFilename = fileStringArray[fileStringArray.length - 1]; // This sets the display name to show the user the name of the file they uploaded
    // console.log(displayFilename);
    $(".fn-chosen-file-full-text").text(displayFilename); // This populates the front end with the name of the file
}

ControllerChange.prototype.inputPurchaseQuantity = function(event){
    // console.log(event);
    g_App.getViewProductPrices().updateGrandTotal(); // This updates the grand total shown to the user in Bitcoin that they must pay
}