import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function GitPanel({
  roomId,
  socket,
  isVisible,
  onClose,
  onFilesFetched,
  username,
}) {
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [gitBranch, setGitBranch] = useState("main");
  const [gitCommitMessage, setGitCommitMessage] = useState("");
  const [gitStatus, setGitStatus] = useState(null);
  const [gitOperationInProgress, setGitOperationInProgress] = useState(false);
  const [gitBranches, setGitBranches] = useState([]);
  const [gitCommitHistory, setGitCommitHistory] = useState([]);

  // Fetch Git status when panel becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchGitStatus();
      fetchGitBranches();
      fetchGitCommitHistory();
    }
  }, [isVisible, roomId]);

  // Listen for Git operations from other users
  useEffect(() => {
    socket.on("git-operation", ({ operation, user, details }) => {
      toast.info(`${user} performed ${operation}: ${details}`);
      fetchGitStatus();
      fetchGitBranches();
      fetchGitCommitHistory();

      // Refresh files in the parent component
      if (onFilesFetched) {
        onFilesFetched();
      }
    });

    return () => {
      socket.off("git-operation");
    };
  }, [socket, onFilesFetched]);

  // Function to initialize a Git repository
  const initializeGitRepo = async () => {
    if (!gitRepoUrl) {
      toast.error("Please enter a Git repository URL");
      return;
    }

    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/init", {
        roomId,
        repoUrl: gitRepoUrl,
        branch: gitBranch,
      });

      if (response.data.success) {
        toast.success("Git repository initialized successfully");
        fetchGitStatus();
        fetchGitBranches();

        // Refresh files in the parent component
        if (onFilesFetched) {
          onFilesFetched();
        }
      } else {
        toast.error(
          response.data.message || "Failed to initialize Git repository"
        );
      }
    } catch (error) {
      console.error("Git initialization error:", error);
      toast.error("Failed to initialize Git repository");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to fetch Git status
  const fetchGitStatus = async () => {
    try {
      const response = await axios.get(`/git/status?roomId=${roomId}`);
      setGitStatus(response.data);
    } catch (error) {
      console.error("Error fetching Git status:", error);
    }
  };

  // Function to fetch Git branches
  const fetchGitBranches = async () => {
    try {
      const response = await axios.get(`/git/branches?roomId=${roomId}`);
      setGitBranches(response.data.branches);
    } catch (error) {
      console.error("Error fetching Git branches:", error);
    }
  };

  // Function to fetch Git commit history
  const fetchGitCommitHistory = async () => {
    try {
      const response = await axios.get(`/git/commits?roomId=${roomId}`);
      setGitCommitHistory(response.data.commits);
    } catch (error) {
      console.error("Error fetching Git commit history:", error);
    }
  };

  // Function to create a new branch
  const createBranch = async () => {
    if (!gitBranch) {
      toast.error("Please enter a branch name");
      return;
    }

    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/branch", {
        roomId,
        branchName: gitBranch,
      });

      if (response.data.success) {
        toast.success(`Branch '${gitBranch}' created successfully`);
        fetchGitBranches();
      } else {
        toast.error(response.data.message || "Failed to create branch");
      }
    } catch (error) {
      console.error("Git branch creation error:", error);
      toast.error("Failed to create branch");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to switch branches
  const switchBranch = async (branchName) => {
    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/checkout", {
        roomId,
        branchName,
      });

      if (response.data.success) {
        toast.success(`Switched to branch '${branchName}'`);
        setGitBranch(branchName);
        fetchGitStatus();

        // Refresh files in the parent component
        if (onFilesFetched) {
          onFilesFetched();
        }
      } else {
        toast.error(response.data.message || "Failed to switch branch");
      }
    } catch (error) {
      console.error("Git branch switch error:", error);
      toast.error("Failed to switch branch");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to stage all changes
  const stageAllChanges = async () => {
    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/add", {
        roomId,
        files: ".", // Stage all files
      });

      if (response.data.success) {
        toast.success("All changes staged");
        fetchGitStatus();
      } else {
        toast.error(response.data.message || "Failed to stage changes");
      }
    } catch (error) {
      console.error("Git stage error:", error);
      toast.error("Failed to stage changes");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to commit changes
  const commitChanges = async () => {
    if (!gitCommitMessage) {
      toast.error("Please enter a commit message");
      return;
    }

    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/commit", {
        roomId,
        message: gitCommitMessage,
      });

      if (response.data.success) {
        toast.success("Changes committed successfully");
        setGitCommitMessage("");
        fetchGitStatus();
        fetchGitCommitHistory();
      } else {
        toast.error(response.data.message || "Failed to commit changes");
      }
    } catch (error) {
      console.error("Git commit error:", error);
      toast.error("Failed to commit changes");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to push changes
  const pushChanges = async () => {
    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/push", {
        roomId,
        branch: gitBranch,
      });

      if (response.data.success) {
        toast.success("Changes pushed successfully");
        fetchGitStatus();
      } else {
        toast.error(response.data.message || "Failed to push changes");
      }
    } catch (error) {
      console.error("Git push error:", error);
      toast.error("Failed to push changes");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  // Function to pull changes
  const pullChanges = async () => {
    setGitOperationInProgress(true);
    try {
      const response = await axios.post("/git/pull", {
        roomId,
      });

      if (response.data.success) {
        toast.success("Changes pulled successfully");
        fetchGitStatus();

        // Refresh files in the parent component
        if (onFilesFetched) {
          onFilesFetched();
        }
      } else {
        toast.error(response.data.message || "Failed to pull changes");
      }
    } catch (error) {
      console.error("Git pull error:", error);
      toast.error("Failed to pull changes");
    } finally {
      setGitOperationInProgress(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white p-4 overflow-y-auto shadow-lg z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Git Operations</h3>
        <button className="text-gray-400 hover:text-white" onClick={onClose}>
          ✕
        </button>
      </div>

      {gitOperationInProgress && (
        <div className="mb-4 text-center">
          <span className="loading loading-spinner loading-md"></span>
          <p>Operation in progress...</p>
        </div>
      )}

      {/* Repository Setup */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <h4 className="font-semibold mb-2">Repository</h4>
        <input
          type="text"
          placeholder="Git Repository URL"
          value={gitRepoUrl}
          onChange={(e) => setGitRepoUrl(e.target.value)}
          className="input input-bordered w-full mb-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Branch"
            value={gitBranch}
            onChange={(e) => setGitBranch(e.target.value)}
            className="input input-bordered flex-1 text-sm"
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={initializeGitRepo}
            disabled={gitOperationInProgress}
          >
            Clone
          </button>
        </div>
      </div>

      {/* Git Status */}
      {gitStatus && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">Status</h4>
          <div className="text-xs">
            <p>
              Current branch:{" "}
              <span className="text-green-400">{gitStatus.current}</span>
            </p>
            {gitStatus.files && (
              <>
                <p className="mt-2 mb-1">Changes:</p>
                <ul className="list-disc pl-4">
                  {gitStatus.files.map((file, index) => (
                    <li
                      key={index}
                      className={
                        file.working_dir === "M"
                          ? "text-yellow-400"
                          : file.working_dir === "A"
                          ? "text-green-400"
                          : file.working_dir === "D"
                          ? "text-red-400"
                          : ""
                      }
                    >
                      {file.path} ({file.working_dir})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* Branches */}
      {gitBranches.length > 0 && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">Branches</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {gitBranches.map((branch, index) => (
              <button
                key={index}
                className={`btn btn-xs ${
                  branch === gitStatus?.current ? "btn-success" : "btn-outline"
                }`}
                onClick={() => switchBranch(branch)}
                disabled={gitOperationInProgress}
              >
                {branch}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New branch name"
              value={gitBranch}
              onChange={(e) => setGitBranch(e.target.value)}
              className="input input-bordered input-sm flex-1 text-sm"
            />
            <button
              className="btn btn-sm btn-outline"
              onClick={createBranch}
              disabled={gitOperationInProgress}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Commit */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <h4 className="font-semibold mb-2">Commit Changes</h4>
        <textarea
          placeholder="Commit message"
          value={gitCommitMessage}
          onChange={(e) => setGitCommitMessage(e.target.value)}
          className="textarea textarea-bordered w-full mb-2 text-sm"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline flex-1"
            onClick={stageAllChanges}
            disabled={gitOperationInProgress}
          >
            Stage All
          </button>
          <button
            className="btn btn-sm btn-primary flex-1"
            onClick={commitChanges}
            disabled={!gitCommitMessage || gitOperationInProgress}
          >
            Commit
          </button>
        </div>
      </div>

      {/* Push & Pull */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <h4 className="font-semibold mb-2">Sync Changes</h4>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline flex-1"
            onClick={pullChanges}
            disabled={gitOperationInProgress}
          >
            Pull
          </button>
          <button
            className="btn btn-sm btn-primary flex-1"
            onClick={pushChanges}
            disabled={gitOperationInProgress}
          >
            Push
          </button>
        </div>
      </div>

      {/* Commit History */}
      {gitCommitHistory.length > 0 && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">Commit History</h4>
          <div className="overflow-y-auto max-h-40">
            {gitCommitHistory.map((commit, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-700 rounded text-xs">
                <p className="font-semibold text-green-400">
                  {commit.hash.substring(0, 7)}
                </p>
                <p>{commit.message}</p>
                <p className="text-gray-400">
                  {commit.author} • {new Date(commit.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
