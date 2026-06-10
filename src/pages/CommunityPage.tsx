import CommunityDisplay from "../components/CommunityDisplay"
import { useParams } from "react-router-dom"

const CommunityPage = () => {
    const { id } =  useParams<{id: string}>()
    
    return (
      <CommunityDisplay communityId={Number(id)} />
  )
}

export default CommunityPage
