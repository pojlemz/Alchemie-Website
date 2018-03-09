function ControllerChange(){

};

ControllerChange.prototype.initialize = function(){
    var self = this;
    $(document).on('change','[changecontroller]',function(event){
        // select the chosen element with $(event.target).
        // Try the code shown below:
        // $(event.target).css('background-color', 'black');
        //
        // console.log(event);
        fnName = $(event.target).attr('changecontroller');
        self[fnName].apply(self, [event]); // This calls the function specified by controllerclick
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