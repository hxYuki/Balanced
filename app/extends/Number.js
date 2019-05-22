/**
 * @param {Number} place place of decimal point
 * @param {Char} symbol symbol for Currency
 * @param {Char} thousand symbol for thousand delimiter
 * @param {Char} decimal symbol for decimal point
 * @returns {String} string in a currency formation
 */
Number.prototype.formatCurrency = function ({place, symbol, thousand, decimal} = {place:2,symbol:'$',thousand:',',decimal:'.'}) {
    place = !isNaN(place = Math.abs(place)) ? place : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(place), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (place ? decimal + Math.abs(number - i).toFixed(place).slice(2) : "");
};

export default Number;