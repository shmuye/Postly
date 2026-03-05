import PostList  from '../components/PostList'
const Home = () => {
  return (
     <div className="pt-10">
      <h2 className="text-2xl sm:text-4xl md:text-6xl text-center font-bold mb-6 bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  )
}

export default Home