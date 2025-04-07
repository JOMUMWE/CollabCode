import { useState, useEffect } from "react";
import axios from "axios";

export default function FileExplorer({ roomId }) {
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const fetchFilesAndFolders = async ( roomId,parentId = null) => {
    try {
      const { data } = await axios.get("/getFilesAndFolders", {
        params: { roomId, parentId },
      });
      setFilesAndFolders(data);
    } catch (error) {
      console.error("Error fetching files and folders:", error);
    }
  };

  useEffect(() => {
    fetchFilesAndFolders(roomId);
  }, [roomId]);

//   console.log("Files and Folders:", filesAndFolders);

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    fetchFilesAndFolders(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
    fetchFilesAndFolders();
  };

  return (
    <div className="file-explorer">
      {currentFolder && (
        <button onClick={handleBackClick} className="btn btn-sm btn-secondary">
          Back
        </button>
      )}
      <ul>
        {filesAndFolders.map((item) => (
          <li key={item._id}>
            {item.type === "folder" ? (
              <button onClick={() => handleFolderClick(item._id)}>
                📁 {item.name}
              </button>
            ) : (
              <span>📄 {item.filename}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
