var fs = require("fs-extra");

fs.remove("dist", function(err) {
    if (err) return console.error('err');
    console.log("dist folder cleared");
});