import { useEffect, useState } from "react";
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
  const [fetchedUsers, setFetchedUsers] = useState(() => []);
  const [fetchedCode, setFetchedCode] = useState(() => "");
  const [language, setLanguage] = useState(() => "javascript");
  const [codeKeybinding, setCodeKeybinding] = useState(() => undefined);

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
    socket.emit("syncing the code", { roomId: roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    socket.emit("update language", { roomId, languageUsed: e.target.value });
    socket.emit("syncing the language", { roomId: roomId });
  }

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(
      e.target.value === "default" ? undefined : e.target.value
    );
  }

  function handleLeave() {
    socket.disconnect();
    !socket.connected && navigate("/dashboard/teams", { replace: true, state: {} });
  }

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
            {/* <select
              className="languageField"
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
            </select> */}
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

          <p >Connected Users:</p>
          <div className="roomSidebarUsers">
            {fetchedUsers.map((each) => (
              <div key={each} className="roomSidebarUsersEach">
                <div
                  className="roomSidebarUsersEachAvatar"
                  style={{ backgroundColor: `${generateColor(each)}` }}
                >
                  {each.slice(0, 2).toUpperCase()}
                </div>
                <div className="roomSidebarUsersEachName">{each}</div>
              </div>
            ))}
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
    </div>
  );
}
