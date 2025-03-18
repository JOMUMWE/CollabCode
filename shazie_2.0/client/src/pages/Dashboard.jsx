import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer';


export default function Dashboard() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
