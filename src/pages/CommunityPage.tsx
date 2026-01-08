
import CommunityDisplay from "../components/CommunityDisplay"
import { useParams } from "react-router-dom"

const CommunityPage = () => {
    const { id } =  useParams<{id: string}>()
    
    return (
    <div>
        <h2>Community Posts</h2>
        <CommunityDisplay communityId={Number(id)} />
    </div>
  )
}

export default CommunityPage