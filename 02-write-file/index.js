const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = require("process");
const textPath = path.join(__dirname, "text.txt");
const output = fs.createWriteStream(textPath);

stdout.write("Hello! Enter the text.\n");
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    goodbye();
  }
  output.write(data);
});

process.on("SIGINT", goodbye);

function goodbye() {
  console.log("\nGood bye!");
  process.exit();
}
