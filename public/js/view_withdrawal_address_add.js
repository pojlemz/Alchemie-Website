function ViewWithdrawalAddressAdd(){

};

ViewWithdrawalAddressAdd.prototype.initialize = function(){

}

// ViewWithdrawalAddressAdd.prototype.showErrorForTakenAddress  = function(){
//     $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">This address is already taken.</div>';
//     $(".fnAlertBox").prepend(htmlMessage);
//     // Make API call to server to see if Address is taken
//     // If address is not taken then add address to user's owned addresses and return positive result
//     // If address is taken then report an error in the ajax call
// }
//
// ViewWithdrawalAddressAdd.prototype.showListOfWithdrawalAddresses = function(addressList){
//     var url = g_App.getAjaxUrlPrefix() + "/get-owned-addresses-by-email";
//     var self = this;
//     $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     $.ajax(url).done(function(msg) { // Make API call to server to see if Address is taken
//         if (msg !== 'You are not logged in.') {
//             var addresses = msg.addresses;
//             // addresses looks like the following:
//             // [{"email":"dan@blockunity.com","address":"bobson-address"},{"email":"dan@blockunity.com","address":"0x0000000000000000000000000000000000000000000000000"},{"email":"dan@blockunity.com","address":""}]
//             $('.fn-owned-addresses-added').empty();
//             for (var i = 0; i < addresses.length; i++) {
//                 $('.fn-owned-addresses-added').append(self.getHtmlForOwnedAddress(addresses[i].address));
//             }
//         }
//     });
//     // {"email":"dan@blockunity.com"}
// }
//
// // Try the following in the Javascript console:
// // g_App.getViewAddressAdd().getHtmlForOwnedAddress('0x012345678902345678901234567890123456789')
// ViewWithdrawalAddressAdd.prototype.getHtmlForOwnedAddress = function(address){
//     // address = '0x012345678902345678901234567890123456789'
//     var html = "";
//     html += '<div class="css-address-group">';
//     html +=     '<span class="css-address-left-tab" id="sizing-addon1" clickcontroller="addAddressToAccount"></span>';
//     html +=     '<div type="text" class="css-address-main-text css-green-background" aria-describedby="sizing-addon1">'+address+'</div>';
//     html += '</div>';
//     return html;
// }
//
// ViewWithdrawalAddressAdd.prototype.addAddressToList = function(address){
//     var self = this;
//     $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     htmlMessage = '<div class="alert alert-success fnShowErrorForTakenAddress">Address added to list for logged in user.</div>';
//     $('.fn-owned-addresses-added').prepend(self.getHtmlForOwnedAddress(address));
// }
//
// ViewWithdrawalAddressAdd.prototype.showErrorForInvalidAddress = function(){
//     $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     htmlMessage = '<div class="alert alert-danger fnShowErrorForTakenAddress">The entered address is invalid.</div>';
//     $(".fnAlertBox").prepend(htmlMessage);
//     // Make API call to server to see if Address is taken
//     // If address is not taken then add address to user's owned addresses and return positive result
//     // If address is taken then report an error in the ajax call
// }
//
// ViewWithdrawalAddressAdd.prototype.showListOfWithdrawalAddresses = function(addressList){
//     var url = g_App.getAjaxUrlPrefix() + "/get-owned-addresses-by-email";
//     var self = this;
//     $(".fnAlertBox .fnShowErrorForTakenAddress").remove();
//     $.ajax(url).done(function(msg) { // Make API call to server to see if Address is taken
//         if (msg !== 'You are not logged in.') {
//             var addresses = msg.addresses;
//             // addresses looks like the following:
//             // [{"email":"dan@blockunity.com","address":"bobson-address"},{"email":"dan@blockunity.com","address":"0x0000000000000000000000000000000000000000000000000"},{"email":"dan@blockunity.com","address":""}]
//             $('.fn-owned-addresses-added').empty();
//             for (var i = 0; i < addresses.length; i++) {
//                 $('.fn-owned-addresses-added').append(self.getHtmlForOwnedAddress(addresses[i].address));
//             }
//         }
//     });
//     // {"email":"dan@blockunity.com"}
//}

ViewWithdrawalAddressAdd.prototype.getHtmlForWithdrawalAddress = function(address){
    // address = '0x012345678902345678901234567890123456789'
    var html = '';
    html += '<div class="css-withdrawal-address fn-withdrawal-address" associate="'+address+'">';
    html +=     '<div class="css-withdrawal-address-main-text fn-withdrawal-address-main-text cssCursorPointer" clickcontroller="selectWithdrawalAddress" aria-describedby="sizing-addon1" associate="'+address+'"> '+address+' </div>';
    html +=     '<div class="cssCursorPointer css-withdrawal-address-delete" clickcontroller="deleteWithdrawalAddress" associate="'+address+'">';
    html +=         '<div class="css-withdrawal-address-delete-image"></div>';
    html +=     '</div>';
    html += '</div>';
    return html;
}


ViewWithdrawalAddressAdd.prototype.handleAddWithdrawalMessage = function(msg){
    var response = JSON.parse(msg);
    if (typeof(response.error) !== "undefined" && response.error !== null) {
        g_App.getViewUserMessages().showCustomErrorMessage(response.error);
    }
    if (typeof(response.success) !== "undefined" && response.success !== null) {
        // Add the withdrawal address to the UI here.
        $(".fn-withdrawal-address-list").append(this.getHtmlForWithdrawalAddress(response.address));
        g_App.getControllerClick().resetClickControllerForSelector('.fn-withdrawal-address-list');
        g_App.getViewUserMessages().showCustomSuccessMessage(response.success);
    }
    g_App.getControllerClick().closeModals();
}