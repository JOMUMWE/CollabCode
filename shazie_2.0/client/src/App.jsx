import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Singin";
import Page404 from "./pages/404page";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Teams from "./components/Teams";
import Dash from "./components/Dash";
import Calendar from "./components/Calendar";
import Projects from "./components/projects";
import { useState } from "react";
import SocketWrapper from "./components/socketWrapper";
import Room from "./pages/Room";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(false);
  const [teamData, setTeamData] = useState("");
  const getprofile = async () => {
    try {
      if (!user) {
        await axios.get("/profile").then(({ data }) => {
          setUser(data);
          console.log(user);
          axios
            .get("/teams/" + data.id)
            .then((response) => {
              setTeamData(response.data);
            })
            .catch((error) => {
              console.error("Error fetching teams:", error);
            });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getprofile();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route
            path="/dashboard/teams"
            element={<Teams user={user.name} team={teamData.teams} />}
          />
          <Route path="/dashboard/dash" element={<Dash />} />
          <Route path="/dashboard/calendar" element={<Calendar />} />
          <Route
            path="/dashboard/projects"
            element={<Projects user={user} />}
          />
        </Route>
        <Route
          path="/room/:roomId"
          element={
            <SocketWrapper>
              <Room name={user.name} userid={user.id} />
            </SocketWrapper>
          }
        />
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App;
