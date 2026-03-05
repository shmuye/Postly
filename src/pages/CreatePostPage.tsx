
import CreatePost from '../components/CreatePost'

const CreatePostPage = () => {
  return (
    <div className="pt-20">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-center bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Create New Post</h2>
        <CreatePost />
    </div>
  )
}

export default CreatePostPage