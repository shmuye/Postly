import CommunityList from "../components/CommunityList"

const CommunitiesPage = () => {
  return (
    <div>
          <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
        Communities
      </h2>
        <CommunityList />
    </div>
  )
}

export default CommunitiesPage