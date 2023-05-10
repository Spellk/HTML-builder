const fs = require("fs").promises;
const path = require("path");
const componentsDir = path.join(__dirname, "components");
const stylesDir = path.join(__dirname, "styles");
const assetsDir = path.join(__dirname, "assets");
const tempFile = path.join(__dirname, "template.html");
const indexFile = "index.html";
const styleFile = "style.css";
const distDir = path.join(__dirname, "project-dist");

async function replaceTemplateTags(template, components) {
  const componentRegex = /{{\s*(\w+)\s*}}/g;
  let result = template;
  let match;
  while ((match = componentRegex.exec(template)) !== null) {
    const [fullMatch, componentName] = match;
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    const componentContent = await fs.readFile(componentPath, "utf-8");
    result = result.replace(fullMatch, componentContent);
  }
  return result;
}

async function buildPage() {
  try {
    await fs.access(distDir);
  } catch (error) {
    await fs.mkdir(distDir, { recursive: true });
  }

  const templateContent = await fs.readFile(tempFile, "utf-8");
  const components = await fs.readdir(componentsDir);
  const indexContent = await replaceTemplateTags(templateContent, components);
  const indexPath = path.join(distDir, indexFile);
  await fs.writeFile(indexPath, indexContent);

  const styleFiles = await fs.readdir(stylesDir);
  const styleContent = await Promise.all(
    styleFiles.map((file) => fs.readFile(path.join(stylesDir, file), "utf-8"))
  );
  const stylePath = path.join(distDir, styleFile);
  await fs.writeFile(stylePath, styleContent.join("\n"));

  const assetFiles = await fs.readdir(assetsDir);
  const assetDir = path.join(distDir, "assets");
  await fs.mkdir(assetDir, { recursive: true });
  for (let file of assetFiles) {
    const sourcePath = path.join(assetsDir, file);
    const destPath = path.join(assetDir, file);
    const stats = await fs.stat(sourcePath);
    if (stats.isDirectory()) {
      await copyFolder(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }
  console.log("Page build successfully");
}

async function copyFolder(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const sourcePath = path.join(src, entry.name);
    const targetPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyFolder(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

buildPage();
