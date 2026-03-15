import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import Loader from "./Loader";

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
        return <Loader />
    }
    if (isError) {
        return <div className="text-center text-red-500 py-4">Error loading post detail.</div>;
    }
  return (
     <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-center bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent wrap-break-word">
        {data?.title}
      </h2>
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-48 sm:h-64"
        />
      )}
      <p className="text-gray-400 wrap-break-words leading-relaxed">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} /> 
      <CommentSection postId={postId} /> 
    </div>
  )
}

export default PostDetail