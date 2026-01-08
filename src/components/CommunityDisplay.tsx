import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import type { Post } from "./PostList"



interface props {
  communityId: number
}

interface PostWithCommunity extends Post {
         communities: {
            name: string
         }
}

const fetchCommunityPosts =  async (communityId: number): Promise<PostWithCommunity[]> => {
    const { data, error } = await supabase
                        .from("posts")
                        .select('*, community(name)')
                        .eq('community_id', communityId )
                        .order('created_at', { ascending: true})
    if(error) throw new Error(error.message)
    return data as PostWithCommunity[]
}


const CommunityDisplay = ({ communityId }: props) => {

  const {data, isLoading, error } = useQuery<PostWithCommunity[], Error>({
    queryKey: ['communityPost', communityId],
    queryFn: () => fetchCommunityPosts(communityId ?? null),
    enabled: communityId != null
  });
  
  if(isLoading) {
      return <div>Loading Community...</div>
  }

    if(error) {
      return <div>Error fetching Community: {error.message}</div>
    }
  return (
    <div className="pt-20">
      <h2>
        { data &&  data[0].communities.name } Community Posts  
        
      </h2>
    </div>
  )
}

export default CommunityDisplay