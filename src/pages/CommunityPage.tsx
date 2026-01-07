import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import type { Post } from "../components/PostList"
import CommunityDisplay from "../components/CommunityDisplay"



const communityPosts =  async (communityId: number | null): Promise<Post[]> => {
    const { data, error } = await supabase
                        .from("posts")
                        .select('*')
                        .eq('community_id', communityId )
    if(error) throw new Error(error.message)
    return data as Post[]
}
const CommunityPage = () => {
    const { } = useQuery({
        queryKey: [],
        queryFn: fetchCommunityPosts,
    })
    return (
    <div>
        <h2>Community Posts</h2>
        <CommunityDisplay />
    </div>
  )
}

export default CommunityPage