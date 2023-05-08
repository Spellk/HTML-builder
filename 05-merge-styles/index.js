const fs = require("fs").promises;
const path = require("path");

const srcDir = "./05-merge-styles/styles";
const destFile = "./05-merge-styles/project-dist/bundle.css";

async function mergeStyles() {
  try {
    const items = await fs.readdir(srcDir);
    const styles = [];

    for (const item of items) {
      const itemPath = path.join(srcDir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isFile() && path.extname(itemPath) === ".css") {
        const content = await fs.readFile(itemPath, "utf-8");
        styles.push(content);
      }
    }

    await fs.writeFile(destFile, styles.join("\n"));

    console.log("Styles have been successfully merged into bundle.css");
  } catch (error) {
    console.error("Error while merging styles:", error);
  }
}

mergeStyles();
