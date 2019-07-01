var url = require('url')
var qs = require('querystring');
module.exports = function () {
    if (arguments.length === 0) {
        throw('miss params');
        return;
    } else if (arguments.length === 1) {
        return arguments[0];
    } else {
        var paramsString = "";
        if (arguments[1] || arguments[1] === null) {
            if (typeof arguments[1] === "string") {
                paramsString = qs.stringify(qs.parse(arguments[1]));
            } else if (typeof arguments[1] === 'object') {
                paramsString = qs.stringify(arguments[1]);
            } else if (typeof arguments[1] === undefined) {
                paramsString = "";
            } else {
                throw('prams type error');
                return;
            }
            var hashString = "";
            if (typeof arguments[2] === "string") {
                //如果有=号
                if (/=/.test(arguments[2])) {
                    //说明要参数化hash
                    hashString = qs.parse(arguments[2].split("#")[1] || "")
                } else {
                    hashString = arguments[2].split("#")[1] || "";
                }
            } else if (typeof arguments[2] === 'object') {
                //如果是一个对象,也query化hash
                hashString = arguments[2];
            }

            var baseUrl = url.parse(arguments[0], true);
            var urlQueryString = qs.stringify(baseUrl.query);
            var queryString = (paramsString || urlQueryString)
                ? ((urlQueryString && paramsString)
                    ? ("?" + urlQueryString + "&" + paramsString)
                    : (urlQueryString
                        ? ("?" + urlQueryString)
                        : (paramsString
                            ? ("?" + paramsString)
                            : "")))
                : "";
            var urlHashString = ((baseUrl.hash || "").split('#')[1]) || ""; //url 本来有的#号

            var hash = "";
            if (typeof hashString === 'string') {
                hash = urlHashString + hashString
            } else if (typeof hashString === 'object') {
                if (urlHashString) {
                    urlHashString = qs.stringify(qs.parse(urlHashString))
                }
                if(urlHashString){
                    hash = urlHashString+"&"+qs.stringify(hashString)
                }else{
                    hash = qs.stringify(hashString)
                }
            }

        }
        var _url = "";
        if (baseUrl.protocol) {
            _url += baseUrl.protocol + "//";
        }
        if (baseUrl.host) {
            _url += baseUrl.host;
        }
        if (baseUrl.port) {
            _url += ":" + baseUrl.port;
        }
        if (baseUrl.pathname) {
            _url += baseUrl.pathname;
        }
        if (hash) {
            hash = "#" + hash;
        }
        return _url + queryString + hash;
    }
};
