import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import PostPage from './pages/PostPage.tsx'
import CommunitiesPage from './pages/CommunitiesPage.tsx'
import CommunityPage from './pages/CommunityPage.tsx'
import { useEffect } from 'react'
import { keepSupabaseAlive } from './utils/keepAlive.ts'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage.tsx'


const App = () => {

  useEffect(() => {
    keepSupabaseAlive();
  }, [])

  return (
    <div className='min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20'>
      <Navbar />
      <Toaster 
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          }
        }}
      />
      <div className='container mx-auto px-4 py-6'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPage />} /> 
            <Route path="community/create" element={<CreateCommunityPage />} /> 
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityPage />}/>
            <Route path='/login' element={<AuthPage />} />
          </Routes>
      </div>
    </div>
  )
}

export default App