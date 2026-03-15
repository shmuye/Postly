import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
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
        return <div className="text-center text-red-500 py-4">Error loading posts.</div>;
    }     
   
  return (
    <div className="p-4 md:p-0 flex flex-col md:flex-row flex-wrap justify-center gap-4 md:w-[80%] mx-auto">
        {
            data && data.map(post => (
                <PostItem key={post.id} post={post} />
            ))      
        }
    </div>
  )
}

export default PostList