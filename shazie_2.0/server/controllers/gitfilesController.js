
const fs = require("fs");
const path = require("path");

const getRepositories = async (req, res) => {
  try {
    const reposPath = path.join(__dirname, "../../server/repos"); // Adjust the path to your local repos folder
    const repos = fs.readdirSync(reposPath, { withFileTypes: true });

    const repoList = repos.map((repo) => ({
      name: repo.name,
      type: repo.isDirectory() ? "folder" : "file",
    }));

    res.status(200).json(repoList);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

const getRepoFiles = async (req, res) => {
  const { repoName, folderPath } = req.query;

  try {
    const basePath = path.join(
      __dirname,
      "../../server/repos",
      repoName,
      folderPath || ""
    );
    const files = fs.readdirSync(basePath, { withFileTypes: true });

    const fileList = files.map((file) => ({
      name: file.name,
      type: file.isDirectory() ? "folder" : "file",
    }));

    res.status(200).json(fileList);
  } catch (error) {
    console.error("Error fetching repository files:", error);
    res.status(500).json({ error: "Failed to fetch repository files" });
  }
};

const getFileContent = async (req, res) => {
  const { repoName, filePath } = req.query;

  try {
    const fullPath = path.join(__dirname, "../../server/repos", repoName, filePath);
    const content = fs.readFileSync(fullPath, "utf-8");

    res.status(200).json({ content });
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
};

const saveFileContent = async (req, res) => {
  const { repoName, filePath, content } = req.body;

  try {
    const fullPath = path.join(__dirname, "../../server/repos", repoName, filePath);
    fs.writeFileSync(fullPath, content, "utf-8");

    res.status(200).json({ message: "File saved successfully" });
  } catch (error) {
    console.error("Error saving file content:", error);
    res.status(500).json({ error: "Failed to save file content" });
  }
};

module.exports = {
  getRepositories,
  getRepoFiles,
  getFileContent,
  saveFileContent,
};