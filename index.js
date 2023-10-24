const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const publicFolderPath = path.join(__dirname, "public");

app.use(express.static(publicFolderPath));

app.get("/new-folder", (req, res) => {
  const folderName = req.query.name;
  if (!folderName) {
    return res.status(400).send("Folder name is missing.");
  }
  const newFolderPath = path.join(publicFolderPath, folderName);
  fs.mkdir(newFolderPath, (err) => {
    if (err) {
      return res.status(500).send("Failed to create the folder.");
    }
    res.send("Folder created successfully.");
  });
});

app.get("/create-files", (req, res) => {
    const folderName = req.query.folder;
    const numberOfFiles = parseInt(req.query.number);
  
    // Check if folderName and numberOfFiles are provided and valid
    if (!folderName || isNaN(numberOfFiles) || numberOfFiles <= 0) {
      return res.status(400).send("Invalid request. Please provide a valid folder and a positive number of files to create.");
    }
  
    const folderPath = path.join(publicFolderPath, folderName);
  
    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  
    // Create text files with content "a" in the specified folder
    for (let i = 1; i <= numberOfFiles; i++) {
      const fileName = `file${i}.txt`;
      const filePath = path.join(folderPath, fileName);
  
      fs.writeFileSync(filePath, generateLoremIpsum(Math.floor(Math.random()*100)));
    }
  
    res.send(`Created ${numberOfFiles} text files in the folder "${folderName}".`);
  });
  
app.get("/read", (req, res) => {
  const folderName = req.query.name;
  if (!folderName) {
    return res.status(400).send("Invalid request. Please provide name=folderName.");
  }
  const folderPath = path.join(publicFolderPath, folderName);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send("Failed to read the folder.");
    }
    let html = "<html>";
    for (let file of files) {
      html += `<a href='${folderName + "/" + file}'> ${file} </a> <br>`;
    }
    html += "</html>";
    res.send(html);
  });
});

app.get("/public", (req, res) => {
  fs.readdir(publicFolderPath, (err, items) => {
    if (err) {
      return res.status(500).send('Failed to read the "public" directory.');
    }
    let html = "<html>";
    for (let item of items) {
      html += `<a href='${"/read?name=" + item}'> ${item} </a> <br>`;
    }
    html += "</html>";
    res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function generateLoremIpsum(numWords) {
    const loremIpsum = "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  
    const loremWords = loremIpsum.split(' ');
    const result = [];
  
    if (numWords <= 0) {
      return "Please specify a valid number of words.";
    }
  
    for (let i = 0; i < numWords; i++) {
      result.push(loremWords[i % loremWords.length]);
    }
  
    return result.join(' ');
  }