String.prototype.endsWith = function (suffix) {
    var theString = this.toString();
    if (suffix.length > theString.length) {
        return false;
    }

    return theString.substring(theString.length - suffix.length) === suffix;
}

String.prototype.reverse = function () {
    var i, reverseString = '', theString = this.toString();

    for (i = theString.length - 1; i >= 0; --i) {
        reverseString += theString.charAt(i);
    }

    return reverseString;
}

String.prototype.startsWith = function (prefix) {
    var theString = this.toString();
    return theString.substring(0, prefix.length) === prefix;
}
