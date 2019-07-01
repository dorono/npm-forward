var fs = require("fs-extra");

fs.copy("node_modules", "dist", function(err) {
    if (err) return console.error('error copying', err);
    console.log("files copied");
});