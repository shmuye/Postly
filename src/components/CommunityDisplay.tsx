import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import type { Post } from "./PostList"
import { PostItem } from "./PostItem"



interface props {
  communityId: number
}

interface PostWithCommunity extends Post {
         community: {
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

  const isValidId = Number.isInteger(communityId);

  const {data, isLoading, error } = useQuery<PostWithCommunity[], Error>({
    queryKey: ['communityPost', communityId],
    queryFn: () => fetchCommunityPosts(communityId ?? null),
    enabled: isValidId
  });

  if (!isValidId) {
    return (
      <div className="text-center py-4 text-red-500">
        Invalid community ID
      </div>
    );
  }
  
  if(isLoading) {
      return <div className="text-center py-4 ">Loading Community...</div>
  }

    if(error) {
      return <div className="text-center py-4 text-red-500">Error fetching Community: {error.message}</div>
    }
  return (
    <div>
      <h2
         className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
      >
        { data &&  data[0]?.community?.name } Community Posts  
      </h2>

      {
        data && data.length > 0 ? (
          <div
            className="flex flex-wrap gap-6 justify-center"
          >
            {
              data.map((post) => (
               <PostItem key={post.id} post={post} />
              ))
            }
          </div>
        ) :
         (<p
           className="text-center text-gray-400"
         >No posts in this community yet</p>)
      }
      
    </div>
  )
}

export default CommunityDisplay