import { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { generateColor } from "../utils";
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

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket }) {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeKeybinding, setCodeKeybinding] = useState(undefined);
  const peerConnections = useRef({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

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
  const codeKeybindingsAvailable = ["default", "emacs", "vim"];

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

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(
      e.target.value === "default" ? undefined : e.target.value
    );
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
          username: data.username,
          text: data.message,
        },
      ]);
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
      <div className="roomSidebar bg-gray-800">
        <div className="flex flex-col items-center ">
          <div>
            <details className="dropdown">
              <summary className="btn m-1">Languages</summary>
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

          <div className="languageFieldWrapper">
            <select
              className="languageField"
              name="codeKeybinding"
              id="codeKeybinding"
              value={codeKeybinding}
              onChange={handleCodeKeybindingChange}
            >
              {codeKeybindingsAvailable.map((eachKeybinding) => (
                <option key={eachKeybinding} value={eachKeybinding}>
                  {eachKeybinding}
                </option>
              ))}
            </select>
          </div>

          <p>Connected Users:</p>
          <div className="roomSidebarUsers">
            {fetchedUsers.map((each) => (
              <div key={each} className="roomSidebarUsersEach">
                <div
                  className="roomSidebarUsersEachAvatar"
                  style={{ backgroundColor: `${generateColor(each)}` }}
                >
                  {each.slice(0, 2).toUpperCase()}
                </div>
                <div className="roomSidebarUsersEachName">
                  {each}
                  <div className="audio-visualizer">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="audio-bar"
                        style={{
                          transform: `scaleY(${
                            (audioLevels[each] || 0) / 128
                          })`,
                          transition: "transform 0.1s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-container bg-base-200 rounded-lg p-4 my-4 h-[300px] flex flex-col">
          <div className="chat-messages overflow-y-auto flex-grow mb-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message mb-2 ${
                  msg.username === "You" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className="font-bold"
                  style={{ color: generateColor(msg.username) }}
                >
                  {msg.username}
                </span>
                <span className="ml-2">{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
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
        theme="monokai"
        name="collabEditor"
        width="full"
        height="auto"
        value={fetchedCode}
        onChange={onChange}
        fontSize={15}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        enableLiveAutocompletion={true}
        enableBasicAutocompletion={false}
        enableSnippets={false}
        wrapEnabled={true}
        tabSize={2}
        editorProps={{
          $blockScrolling: true,
        }}
      />
      <Toaster />
      <div className="audio-controls">
        <audio id="localAudio" autoPlay muted playsInline />
        <audio id="remoteAudio" autoPlay playsInline />
      </div>
    </div>
  );
}
