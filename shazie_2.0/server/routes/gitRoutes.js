const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { simpleGit } = require('simple-git');
const { v4: uuidv4 } = require('uuid');

// Base directory for storing Git repositories
const REPOS_DIR = path.join(__dirname, '../repos');

// Ensure the repos directory exists
if (!fs.existsSync(REPOS_DIR)) {
  fs.mkdirSync(REPOS_DIR, { recursive: true });
}

// Helper function to get the repository path for a room
const getRepoPath = (roomId) => {
  return path.join(REPOS_DIR, roomId);
};

// Helper function to get a git instance for a room
const getGit = (roomId) => {
  const repoPath = getRepoPath(roomId);
  return simpleGit(repoPath);
};

// Initialize or clone a Git repository
router.post('/init', async (req, res) => {
  const { roomId, repoUrl, branch } = req.body;
  
  if (!roomId || !repoUrl) {
    return res.status(400).json({ success: false, message: 'Room ID and repository URL are required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository already exists
    if (fs.existsSync(repoPath)) {
      // If it exists, just fetch the latest changes
      const git = getGit(roomId);
      await git.fetch('origin');
      return res.json({ success: true, message: 'Repository already exists, fetched latest changes' });
    }
    
    // Create the directory
    fs.mkdirSync(repoPath, { recursive: true });
    
    // Clone the repository
    const git = simpleGit();
    await git.clone(repoUrl, repoPath);
    
    // Checkout the specified branch if provided
    if (branch && branch !== 'main' && branch !== 'master') {
      const repoGit = getGit(roomId);
      await repoGit.checkout(['-b', branch, `origin/${branch}`]);
    }
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'clone',
      user: req.user?.name || 'A user',
      details: `Cloned repository from ${repoUrl}`
    });
    
    res.json({ success: true, message: 'Repository cloned successfully' });
  } catch (error) {
    console.error('Git clone error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get repository status
router.get('/status', async (req, res) => {
  const { roomId } = req.query;
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    const status = await git.status();
    
    res.json(status);
  } catch (error) {
    console.error('Git status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get repository branches
router.get('/branches', async (req, res) => {
  const { roomId } = req.query;
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    const branchSummary = await git.branch();
    
    // Extract branch names
    const branches = Object.keys(branchSummary.branches);
    
    res.json({ branches });
  } catch (error) {
    console.error('Git branches error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new branch
router.post('/branch', async (req, res) => {
  const { roomId, branchName } = req.body;
  
  if (!roomId || !branchName) {
    return res.status(400).json({ success: false, message: 'Room ID and branch name are required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    await git.checkoutLocalBranch(branchName);
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'branch',
      user: req.user?.name || 'A user',
      details: `Created new branch: ${branchName}`
    });
    
    res.json({ success: true, message: `Branch '${branchName}' created successfully` });
  } catch (error) {
    console.error('Git branch creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Checkout a branch
router.post('/checkout', async (req, res) => {
  const { roomId, branchName } = req.body;
  
  if (!roomId || !branchName) {
    return res.status(400).json({ success: false, message: 'Room ID and branch name are required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    await git.checkout(branchName);
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'checkout',
      user: req.user?.name || 'A user',
      details: `Switched to branch: ${branchName}`
    });
    
    res.json({ success: true, message: `Switched to branch '${branchName}'` });
  } catch (error) {
    console.error('Git checkout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stage files
router.post('/add', async (req, res) => {
  const { roomId, files } = req.body;
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    await git.add(files || '.');
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'add',
      user: req.user?.name || 'A user',
      details: `Staged changes`
    });
    
    res.json({ success: true, message: 'Changes staged successfully' });
  } catch (error) {
    console.error('Git add error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Commit changes
router.post('/commit', async (req, res) => {
  const { roomId, message } = req.body;
  
  if (!roomId || !message) {
    return res.status(400).json({ success: false, message: 'Room ID and commit message are required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    await git.commit(message);
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'commit',
      user: req.user?.name || 'A user',
      details: `Committed changes: ${message}`
    });
    
    res.json({ success: true, message: 'Changes committed successfully' });
  } catch (error) {
    console.error('Git commit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Push changes
router.post('/push', async (req, res) => {
  const { roomId, branch } = req.body;
  
  if (!roomId) {
    return res.status(400).json({ success: false, message: 'Room ID is required' });
  }
  
  const repoPath = getRepoPath(roomId);
  
  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }
    
    const git = getGit(roomId);
    await git.push('origin', branch || 'HEAD');
    
    // Broadcast to all users in the room
    req.app.get('io').to(roomId).emit('git-operation', {
      operation: 'push',
      user: req.user?.name || 'A user',
      details: `Pushed changes to remote`
    });
    
    res.json({ success: true, message: 'Changes pushed successfully' });
  } catch (error) {
    console.error('Git push error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pull changes
router.post("/pull", async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res
      .status(400)
      .json({ success: false, message: "Room ID is required" });
  }

  const repoPath = getRepoPath(roomId);

  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res
        .status(404)
        .json({ success: false, message: "Repository not found" });
    }

    const git = getGit(roomId);
    await git.pull();

    // Broadcast to all users in the room
    req.app
      .get("io")
      .to(roomId)
      .emit("git-operation", {
        operation: "pull",
        user: req.user?.name || "A user",
        details: `Pulled latest changes from remote`,
      });

    res.json({ success: true, message: "Changes pulled successfully" });
  } catch (error) {
    console.error("Git pull error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get commit history
router.get("/commits", async (req, res) => {
  const { roomId } = req.query;

  if (!roomId) {
    return res
      .status(400)
      .json({ success: false, message: "Room ID is required" });
  }

  const repoPath = getRepoPath(roomId);

  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res
        .status(404)
        .json({ success: false, message: "Repository not found" });
    }

    const git = getGit(roomId);
    const log = await git.log({ maxCount: 10 }); // Get last 10 commits

    // Format the commit history
    const commits = log.all.map((commit) => ({
      hash: commit.hash,
      date: commit.date,
      message: commit.message,
      author: commit.author_name,
    }));

    res.json({ commits });
  } catch (error) {
    console.error("Git log error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get file content from repository
router.get("/file", async (req, res) => {
  const { roomId, path: filePath } = req.query;

  if (!roomId || !filePath) {
    return res
      .status(400)
      .json({ success: false, message: "Room ID and file path are required" });
  }

  const repoPath = getRepoPath(roomId);
  const fullPath = path.join(repoPath, filePath);

  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res
        .status(404)
        .json({ success: false, message: "Repository not found" });
    }

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Read the file content
    const content = fs.readFileSync(fullPath, "utf8");

    res.json({ content });
  } catch (error) {
    console.error("Git file read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Save file to repository
router.post("/save", async (req, res) => {
  const { roomId, path: filePath, content } = req.body;

  if (!roomId || !filePath) {
    return res
      .status(400)
      .json({ success: false, message: "Room ID and file path are required" });
  }

  const repoPath = getRepoPath(roomId);
  const fullPath = path.join(repoPath, filePath);

  try {
    // Check if the repository exists
    if (!fs.existsSync(repoPath)) {
      return res
        .status(404)
        .json({ success: false, message: "Repository not found" });
    }

    // Ensure the directory exists
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the file content
    fs.writeFileSync(fullPath, content, "utf8");

    // Broadcast to all users in the room
    req.app
      .get("io")
      .to(roomId)
      .emit("git-operation", {
        operation: "save",
        user: req.user?.name || "A user",
        details: `Saved file: ${filePath}`,
      });

    res.json({ success: true, message: "File saved successfully" });
  } catch (error) {
    console.error("Git file save error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
