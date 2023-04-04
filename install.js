const http = require('http');
const decompress = require("decompress");
const fs = require("fs");

const file = fs.createWriteStream("temp.zip");

const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
   response.pipe(file);

   file.on("finish", () => {
       file.close();
       decompress("temp.zip", "")
   });
});