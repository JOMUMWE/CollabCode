import { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { generateColor } from "../utils";
import { PlusIcon } from "@heroicons/react/outline";
import axios from "axios";
import "./Room.css";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";

//for loading the languages on demand to be used later
// const loadMode = async (language) => {
//   await import(`ace-builds/src-noconflict/mode-${language}`);
// };

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket, userid, name }) {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [codeKeybinding, setCodeKeybinding] = useState(undefined);
  const peerConnections = useRef({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [uploadedFileContent, setUploadedFileContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const supportedExtensions = {
    javascript: [".js"],
    java: [".java"],
    c_cpp: [".c", ".cpp", ".h"],
    python: [".py"],
    typescript: [".ts"],
    golang: [".go"],
    yaml: [".yaml", ".yml"],
    html: [".html"],
    css: [".css"],
  };

  // Function to determine displayed users and extra count
  const getDisplayedUsers = () => {
    const maxVisibleAvatars = 3;
    const displayedUsers = fetchedUsers.slice(0, maxVisibleAvatars);
    const extraCount = fetchedUsers.length - maxVisibleAvatars;
    return { displayedUsers, extraCount };
  };

  const { displayedUsers, extraCount } = getDisplayedUsers();

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/getFilesForRoom?roomId=${roomId}`);
      setUploadedFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to fetch files.");
    }
  };
  useEffect(() => {
    fetchFiles();
  }, [roomId]);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop();
    const isSupported = Object.keys(supportedExtensions).some((lang) =>
      supportedExtensions[lang].includes(`.${fileExtension}`)
    );

    if (!isSupported) {
      toast.error("Unsupported file format. Please upload a supported file.");
      return;
    }

    try {
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        try {
          // Send the file to the backend
          const uploadResponse = await axios.post("/uploadFile", {
            roomId,
            filename: file.name,
            content: fileContent,
            uploadedBy: userid, // Assuming the user's ID is available in the socket
          });

          // Set the file content locally
          setUploadedFileContent(fileContent);
          setFetchedCode(fileContent);

          // Emit the updated code to the server
          socket.emit("update code", { roomId, code: fileContent });
          toast.success(uploadResponse.message);
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Failed to upload file.");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Error checking team projects:", error);
      toast.error("Failed to check team projects.");
    }
  };

  const toggleChat = () => {
    setIsChatVisible((prev) => {
      if (!prev) {
        // Reset unread messages when opening the chat
        setUnreadMessages(0);
      }
      return !prev;
    });
  };

  const languagesAvailable = [
    "javascript",
    "java",
    "c_cpp",
    "python",
    "typescript",
    "golang",
    "yaml",
    "html",
  ];

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the code", { roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    socket.emit("update language", { roomId, languageUsed: e.target.value });
    socket.emit("syncing the language", { roomId });
  }

  function handleLeave() {
    socket.disconnect();
    !socket.connected &&
      navigate("/dashboard/teams", { replace: true, state: {} });
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const messageData = {
        roomId,
        message: messageInput,
        username: socket.id,
      };

      // Add message locally
      setMessages((prev) => [
        ...prev,
        {
          username: "You",
          text: messageInput,
        },
      ]);

      // Send to others
      socket.emit("chat message", messageData);
      setMessageInput("");
    }
  };

  useEffect(() => {
    socket.on("updating client list", ({ userslist }) => {
      setFetchedUsers(userslist);
    });

    socket.on("on language change", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });

    socket.on("on code change", ({ code }) => {
      setFetchedCode(code);
    });

    socket.on("new member joined", ({ username }) => {
      toast(`${username} joined`);
    });

    socket.on("member left", ({ username }) => {
      toast(`${username} left`);
    });

    // Add this in your first useEffect block
    socket.on("chat message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          username: name,
          text: data.message,
        },
      ]);
      // Increment unread messages if the chat is not visible
      if (!isChatVisible) {
        setUnreadMessages((prev) => prev + 1);
      }
    });

    const backButtonEventListner = window.addEventListener(
      "popstate",
      function (e) {
        const eventStateObj = e.state;
        if (!("usr" in eventStateObj) || !("username" in eventStateObj.usr)) {
          socket.disconnect();
        }
      }
    );
    return () => {
      window.removeEventListener("popstate", backButtonEventListner);
      socket.off("on code change");
    };
  }, [socket]);

  const [audioLevels, setAudioLevels] = useState({});

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyzer);
        analyzer.fftSize = 256;

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        function updateAudioLevel() {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevels((prev) => ({
            ...prev,
            [socket.id]: average,
          }));
          requestAnimationFrame(updateAudioLevel);
        }

        updateAudioLevel();
      });
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        // Store stream reference
        const localStream = stream;

        // Set local audio
        const localAudio = document.getElementById("localAudio");
        if (localAudio) {
          localAudio.srcObject = localStream;
        }

        socket.on("webrtc-offer", async ({ sdp, caller }) => {
          const peerConnection = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
            ],
          });

          peerConnections.current[caller] = peerConnection;

          // Add local tracks to the connection
          localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
          });

          // Handle incoming streams
          peerConnection.ontrack = (event) => {
            const remoteAudio = document.getElementById("remoteAudio");
            if (remoteAudio && event.streams[0]) {
              remoteAudio.srcObject = event.streams[0];
            }
          };

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("webrtc-ice-candidate", {
                target: caller,
                candidate: event.candidate,
              });
            }
          };

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socket.emit("webrtc-answer", {
            target: caller,
            sdp: peerConnection.localDescription,
          });
        });

        socket.on("webrtc-answer", async ({ sdp, caller }) => {
          console.log("Received answer from", caller);
          const peerConnection = peerConnections.current[caller];
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
        });

        socket.on("webrtc-ice-candidate", ({ candidate, caller }) => {
          console.log("Received ICE candidate from", caller);
          const peerConnection = peerConnections.current[caller];
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("new member joined", async ({ username }) => {
          console.log("New member joined:", username);
          const peerConnection = new RTCPeerConnection();
          peerConnections.current[socket.id] = peerConnection;

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("webrtc-ice-candidate", {
                target: socket.id,
                candidate: event.candidate,
              });
            }
          };

          peerConnection.ontrack = (event) => {
            console.log("Received remote stream");
            const remoteAudio = document.querySelector("#remoteAudio");
            remoteAudio.srcObject = event.streams[0];
          };

          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          socket.emit("webrtc-offer", {
            target: socket.id,
            sdp: peerConnection.localDescription,
          });
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    return () => {
      Object.values(peerConnections.current).forEach((peerConnection) => {
        peerConnection.close();
      });
      peerConnections.current = {};
    };
  }, [socket, roomId]);

  return (
    <div className="room">
      <div className="avatar-group fixed top-4 right-4 -space-x-3 z-1">
        {displayedUsers.map((user, index) => (
          <div
            key={index}
            className="avatar w-10 h-10 flex flex-row justify-center items-center"
            style={{
              backgroundColor: generateColor(user),
            }}
          >
            <p>{user.slice(0, 2).toUpperCase()}</p>
          </div>
        ))}
        {extraCount > 0 && (
          <div className="avatar avatar-placeholder">+{extraCount}</div>
        )}
      </div>
      <div className="roomSidebar bg-gray-800">
        <div className="flex flex-col items-center ">
          <div className="file-upload-container flex items-center mt-4">
            <label
              htmlFor="file-upload"
              className="flex items-center text-white cursor-pointer hover:underline"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Open File
            </label>
            <input
              id="file-upload"
              type="file"
              accept={Object.values(supportedExtensions).flat().join(",")}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div>
            <details className="dropdown">
              <summary className="m-1 text-white cursor-pointer hover:underline">
                {language ? language : "Languages"}
              </summary>
              <select
                className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                name="language"
                id="language"
                value={language}
                onChange={handleLanguageChange}
              >
                {languagesAvailable.map((eachLanguage) => (
                  <option key={eachLanguage} value={eachLanguage}>
                    {eachLanguage}
                  </option>
                ))}
              </select>
            </details>
          </div>
        </div>
        <div className="file-list mt-4">
          <h3 className="text-white text-sm ml-1 mb-2">Files:</h3>
          <ul className="text-white">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="mb-1 ml-3">
                <button
                  className="text-gray-300 hover:underline text-xs m-0 p-0"
                  onClick={() => setFetchedCode(file.content)} // Open file content in editor
                >
                  {file.filename}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="btn btn-sm btn-outline btn-error self-end w-[50%] mx-auto"
          onClick={() => {
            handleLeave();
          }}
        >
          Leave
        </button>
      </div>

      <AceEditor
        placeholder="Happy Coding!!!"
        className="roomCodeEditor"
        mode={language}
        keyboardHandler={codeKeybinding}
        theme="dracula"
        name="collabEditor"
        width="full"
        height="auto"
        value={fetchedCode}
        onChange={onChange}
        fontSize={15}
        showLineNumbers={true}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        enableLiveAutocompletion={true}
        enableBasicAutocompletion={false}
        enableSnippets={true}
        wrapEnabled={true}
        tabSize={2}
        editorProps={{
          $blockScrolling: true,
        }}
        setOptions={{
          showFoldWidgets: true, // Enable fold widgets
          tooltipFollowsMouse: true, // Enable tooltips
        }}
        // annotations={[
        //   {
        //     row: 2, // Line number
        //     column: 4, // Column number
        //     text: "This is a warning", // Text to display
        //     type: "warning", // Can be 'error', 'warning', or 'info'
        //   },
        // ]}
        commands={[
          {
            name: "undo",
            bindKey: { win: "Ctrl-Z", mac: "Command-Z" },
            exec: (editor) => editor.undo(),
          },
          {
            name: "redo",
            bindKey: { win: "Ctrl-Y", mac: "Command-Y" },
            exec: (editor) => editor.redo(),
          },
        ]}
      />
      <Toaster />
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-500"
        onClick={toggleChat}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
        {unreadMessages > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
      </button>
      {/* Floating Chat Container */}
      {isChatVisible && (
        <div className="fixed bottom-16 right-4 bg-black shadow-lg rounded-lg w-80 h-96 flex flex-col">
          <div className="chat-messages overflow-y-auto flex-grow p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat mb-2 flex flex-col ${
                  msg.username === "You" ? "chat-start" : "chat-end"
                }`}
              >
                <span
                  className="font-semibold text-xs"
                  style={{ color: generateColor(msg.username) }}
                >
                  {msg.username}
                </span>
                <span className="text-sm font-semibold chat-bubble">{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="chat-input-container p-2 border-t">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="input input-bordered w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
