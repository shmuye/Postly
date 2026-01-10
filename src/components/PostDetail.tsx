import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
interface props {
    postId: number;
}       

const getPostDetail = async (id: number): Promise<Post> => {
    // Fetch post detail logic here
    const { data, error } = await supabase
                 .from('posts')
                 .select('*')
                 .eq('id', id)
                 .single();
    if (error) {
        throw new Error(error.message);
    }  

    return data as Post 
}   
const PostDetail = ({ postId }: props) => {

    const { data, isLoading, isError } = useQuery<Post, Error>({
        queryKey: ['post', postId],
        queryFn: () => getPostDetail(postId),
    });

    if (isLoading) {
        return <div className="text-center py-4">Loading post detail...</div>;
    }
    if (isError) {
        return <div className="text-center text-red-500 py-4">Error loading post detail.</div>;
    }
  return (
     <div className="space-y-6 w-[80%] mx-auto">
      <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} /> 
      <CommentSection postId={postId} /> 
    </div>
  )
}

export default PostDetail