import CommunityList from "../components/CommunityList"
import PageHeader from "../components/PageHeader"

const CommunitiesPage = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Communities"
        description="Browse and join communities that match your interests"
      />
      <CommunityList />
    </div>
  )
}

export default CommunitiesPage
