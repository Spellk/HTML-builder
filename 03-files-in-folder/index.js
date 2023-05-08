const fs = require("fs");
const path = require("path");
const folderPath = "./03-files-in-folder/secret-folder";

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error("Directory read error:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error("File read error:", err);
        return;
      }

      if (stats.isFile()) {
        const parsedPath = path.parse(file);
        const fileName = parsedPath.name;
        const fileExtension = parsedPath.ext.substring(1);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    });
  });
});
