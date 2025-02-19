import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'

function App() {
  
  return (
    <div className='flex mx-w-6xl mx-auto'>
      <Sidebar /> {/*common component bc it does not wrapped with Routes*/}
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignUpPage />}/>
        </Routes>
      <RightPanel />  
    </div>
  )
}

export default App
