import PostList from '../components/PostList'
import PageHeader from '../components/PageHeader'

const Home = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recent Posts"
        description="Discover what people are sharing across communities"
      />
      <PostList />
    </div>
  )
}

export default Home
