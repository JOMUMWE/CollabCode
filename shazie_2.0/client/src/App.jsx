import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Singin'
import Page404 from './pages/404page'
import Dashboard from './pages/Dashboard'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import Teams from './components/Teams'
import Dash from './components/Dash'
import Calendar from './components/Calendar'
import Projects from './components/projects'



axios.defaults.baseURL = 'https://8000-jomumwe-collabcode-kswko7rn7zm.ws-eu117.gitpod.io'
axios.defaults.withCredentials = true

function App() {
  
  return (
    <>
      <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} >
          <Route path='/dashboard/teams' element={<Teams />}/>
          <Route path='/dashboard/dash' element={<Dash />}/>
          <Route path='/dashboard/calendar' element={<Calendar />}/>
          <Route path='/dashboard/projects' element={<Projects />}/>
        </Route>
        <Route path="/*" element={<Page404 />} />
        </Routes>
      </>
  )
}

export default App
