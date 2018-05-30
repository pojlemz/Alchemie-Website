module.exports = function getUsdToBtc(usdAmount) {
    return parseFloat((usdAmount / 10000).toFixed(8))
}