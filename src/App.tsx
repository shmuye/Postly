import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import PostPage from './pages/PostPage.tsx'
import CommunitiesPage from './pages/CommunitiesPage.tsx'


const App = () => {
  return (
    <div className='min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20'>
      <Navbar />
      <div className='container mx-auto px-4 py-6'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPage />} /> 
            <Route path="community/create" element={<CreateCommunityPage />} /> 
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
          </Routes>
      </div>
    </div>
  )
}

export default App