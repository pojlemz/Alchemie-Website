function WebSockets(){
    this._webSocket = null;
    this._btcAddress = "";
};

WebSockets.prototype.initialize = function(){

}

WebSockets.prototype.getWebSocket = function(){
    return this._webSocket;
}

WebSockets.prototype.startConnection = function(btcAddress){
    // $("#fn-modal-overlay").show();
    // $(".fn-modal-user-message-box").empty();
    // var modal = $("." + modalName);
    // modal.show();
    // TODO: Consider storing the Bitcoin address in a local variable

    var self = this;
    this._btcAddress = btcAddress;

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        content.html($('<p>',
            { text:'Sorry, but your browser doesn\'t support WebSocket.'}
        ));
        // input.hide();
        // $('span').hide();
        return;
    }

    var connection = new WebSocket("wss://bitgowebsockets.blockunity.com:443");
    this._webSocket = connection;
    connection.onopen = function () {
        // first we want users to enter their names
        // input.removeAttr('disabled');
        // status.text('Choose name:');
    };
    connection.onerror = function (error) {
        // just in there were some problems with connection...
        console.error('Sorry, but there\'s some problem with your ' + 'connection or the server is down.');
    };
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server
        // always returns JSON this should work without any problem but
        // we should make sure that the massage is not chunked or
        // otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }

        if (json.type === 'connect') {
            connection.send(JSON.stringify({ type: 'connect', data: {address: btcAddress} }));
        }

        if (json.type === 'rhubarb') {

        }

        if (json.type === 'paid') {
            g_App.getControllerClick().closeModals();
            g_App.getViewModals().showModal("fn-payment-received-modal");
        }
    };

}