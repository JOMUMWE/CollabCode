import { useState, useEffect } from "react";
import axios from "axios";

export default function FileExplorer({ roomId, onFileOpen }) {
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const fetchRepositories = async () => {
    try {
      const { data } = await axios.get("/getRepositories");
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  const fetchFilesAndFolders = async (repoName, folderPath = "") => {
    try {
      const { data } = await axios.get("/getRepoFiles", {
        params: { repoName, folderPath },
      });
      setFilesAndFolders(data);
    } catch (error) {
      console.error("Error fetching files and folders:", error);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleRepoClick = (repoName) => {
    setCurrentRepo(repoName);
    fetchFilesAndFolders(repoName);
  };

  const handleFolderClick = (folderName) => {
    const newFolderPath = currentFolder
      ? `${currentFolder}/${folderName}`
      : folderName;
    setCurrentFolder(newFolderPath);
    fetchFilesAndFolders(currentRepo, newFolderPath);
  };

  const handleBackClick = () => {
    if (!currentFolder) {
      setCurrentRepo(null);
      return;
    }

    const newFolderPath = currentFolder.split("/").slice(0, -1).join("/");
    setCurrentFolder(newFolderPath || null);
    fetchFilesAndFolders(currentRepo, newFolderPath);
  };

  const handleFileClick = async (file) => {
    try {
      const { data } = await axios.get("/getFileContent", {
        params: {
          repoName: currentRepo,
          filePath: `${currentFolder}/${file.name}`,
        },
      });

      // Emit the file content to the parent component
      onFileOpen({
        filename: file.name,
        content: data.content,
        repoName: currentRepo,
        filePath: `${currentFolder}/${file.name}`,
      });
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <div className="file-explorer text-xs mt-3">
      <h2 className="text-sm font-bold mb-2">Git File Explorer</h2>
      {!currentRepo ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo.name}>
              <button onClick={() => handleRepoClick(repo.name)}>
                📁 {repo.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {currentFolder && (
            <button
              onClick={handleBackClick}
              className="btn btn-sm btn-secondary"
            >
              Back
            </button>
          )}
          <ul>
            {filesAndFolders.map((item) => (
              <li key={item.name}>
                {item.type === "folder" ? (
                  <button onClick={() => handleFolderClick(item.name)}>
                    📁 {item.name}
                  </button>
                ) : (
                  <button onClick={() => handleFileClick(item)}>
                    📄 {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
