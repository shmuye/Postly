import CreatePost from '../components/CreatePost'
import PageHeader from '../components/PageHeader'

const CreatePostPage = () => {
  return (
    <div className="space-y-8">
      <PageHeader title="Create New Post" />
      <CreatePost />
    </div>
  )
}

export default CreatePostPage
