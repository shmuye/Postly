import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase-client";
import { PostItem } from "./PostItem"; 
import Loader from "./Loader";

export interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    avatar_url?: string;
    like_count?: number; 
    comment_count?: number;
}


const fetchPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase.rpc('get_posts_with_count')

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
}   

const PostList = () => {
    const { data, isLoading, isError } = useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) {
       return <Loader />
    }

    if (isError) {
        return (
          <p className="py-12 text-center text-destructive">
            Error loading posts.
          </p>
        );
    }

    if (!data?.length) {
      return (
        <p className="py-12 text-center text-muted-foreground">
          No posts yet. Be the first to share something!
        </p>
      )
    }
   
  return (
    <div className="flex flex-wrap justify-center gap-4">
        {data.map(post => (
            <PostItem key={post.id} post={post} />
        ))}
    </div>
  )
}

export default PostList
