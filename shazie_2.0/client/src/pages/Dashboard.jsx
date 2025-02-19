import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Footer from '../components/Footer';


export default function Dashboard() {
  const [user, setUser] = useState("");
  const navigate = useNavigate()
  // const logged = user ? true : false;

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
      });
    }

  }, []);

  const logoutUser = () => {
    try {
      axios.get("/logout").then(() => {
        toast.success("logged out")
        navigate("/signin");
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
