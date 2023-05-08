const fs = require("fs").promises;
const path = require("path");

async function copyDir(src, dest) {
  try {
    await fs.access(src);
    await fs.mkdir(dest, { recursive: true });

    const srcItems = await fs.readdir(src, { withFileTypes: true });
    const destItems = await fs.readdir(dest, { withFileTypes: true });

    await Promise.all(
      destItems.map(async (item) => {
        if (!srcItems.some((srcItem) => srcItem.name === item.name)) {
          const destItemPath = path.join(dest, item.name);
          if (item.isFile()) {
            await fs.unlink(destItemPath);
          } else if (item.isDirectory()) {
            await fs.rmdir(destItemPath, { recursive: true });
          }
        }
      })
    );

    await Promise.all(
      srcItems.map(async (item) => {
        const srcItemPath = path.join(src, item.name);
        const destItemPath = path.join(dest, item.name);

        if (item.isFile()) {
          await fs.copyFile(srcItemPath, destItemPath);
        } else if (item.isDirectory()) {
          await copyDir(srcItemPath, destItemPath);
        }
      })
    );
  } catch (error) {
    console.error("Error while copying directory:", error);
  }
}

const sourcePath = "./04-copy-directory/files";
const destinationPath = "./04-copy-directory/files-copy";

copyDir(sourcePath, destinationPath);
