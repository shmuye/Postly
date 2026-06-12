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
import { Toaster } from '@/components/ui/sonner'
import AuthPage from './pages/AuthPage.tsx'
import AuthCallbackPage from './pages/AuthCallbackPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'


const App = () => {

  useEffect(() => {
    keepSupabaseAlive();
  }, [])

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />
      <Toaster position="top-right" richColors closeButton />
      <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPage />} /> 
            <Route path="community/create" element={<CreateCommunityPage />} /> 
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityPage />}/>
            <Route path='/login' element={<AuthPage />} />
            <Route path='/auth/callback' element={<AuthCallbackPage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Routes>
      </main>
    </div>
  )
}

export default App
