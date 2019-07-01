var fs = require("fs-extra");

fs.rename("node_modules", "dist", function(err) {
    if (err) return console.error('err', err);
    console.log("node_modules folder renamed");
});