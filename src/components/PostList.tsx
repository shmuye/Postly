import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { PostItem } from "./PostItem"; 

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
        return <div>Loading posts...</div>;
    }

    if (isError) {
        return <div>Error loading posts.</div>;
    }     
    
    console.log(data);
  return (
    <div className="flex justify-center gap-4">
        {
            data && data.map(post => (
                <PostItem key={post.id} post={post} />
            ))      
        }
    </div>
  )
}

export default PostList