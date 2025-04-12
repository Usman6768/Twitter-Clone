import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import Sidebar from './components/common/SideBar'
import RightPanel from './components/common/RightPanel'
import ProfilePage from './pages/profile/ProfilePage'
import NotificationPage from './pages/notification/NotificationPage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {

  const {data:authUser, isLoading} = useQuery({
    // we use querykey to give a unique name to our query and refer to it later 
    queryKey: ['authUser'], // Unique key for caching and tracking
    queryFn: async () => { // function to fetch data
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null; // as when we are logging out the data we are getting is undefined and it does not redirecting user to login page thats why we are explicitly returning null
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        console.log("AuthUser is here : ", data);
        
        return data;

      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false // if the query fails, it will not be retried
  })

  if(isLoading){
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  
  return (
    <div className='flex mx-w-6xl mx-auto'>
      {authUser && <Sidebar />} {/*common component bc it does not wrapped with Routes*/}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login"/>}/>
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>}/>
        </Routes>
      {authUser && <RightPanel />}  
      <Toaster />
    </div>
  )
}

export default App
