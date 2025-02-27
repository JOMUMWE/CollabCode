import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from '../components/Footer';


export default function Dashboard() {
  
  const navigate = useNavigate()
  // const logged = user ? true : false;

  

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
