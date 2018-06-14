module.exports = function handleOrderPromise(orderPromise, address, blockHeight, value) {
    if (orderPromise === null || typeof(orderPromise) === 'undefined') {
        const status = orderPromise.status;
        if (status === "Unpaid") {
            if (orderPromise.grandtotal <= value) {
                // We can consider the order to be paid here since the value of the unspent is less than the total.

            }
        } else if (status === "Paid") {

        }
        // TODO: Add a branch for all of the rejected states
    } else {
        // In this case the unspent transaction doesn't correspond to an orderpromise in the table
        // TODO: Find a way to handle unspent outputs that don't correspond to any orders (ie. outgoing change outputs)
    }
}