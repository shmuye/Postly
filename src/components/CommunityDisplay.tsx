import { useQuery } from "@tanstack/react-query"
import type { Post } from "./PostList"
import { PostItem } from "./PostItem"
import PageHeader from "./PageHeader"
import Loader from "./Loader"
import { supabase } from "@/lib/supabase-client"


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

  const {data, isLoading, error } = useQuery<PostWithCommunity[], Error>({
    queryKey: ['communityPost', communityId],
    queryFn: () => fetchCommunityPosts(communityId),
  });
   
  if(isLoading) {
      return <Loader />
  }

    if(error) {
      return (
        <p className="py-12 text-center text-destructive">
          Error fetching community: {error.message}
        </p>
      )
    }

  const communityName = data?.[0]?.community?.name ?? "Community"

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${communityName} Posts`}
        description="Explore posts from this community"
      />

      {data && data.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No posts in this community yet.
        </p>
      )}
    </div>
  )
}

export default CommunityDisplay
