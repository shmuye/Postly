import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import Loader from "./Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface props {
    postId: number;
}       

const getPostDetail = async (id: number): Promise<Post> => {
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
        return (
          <p className="py-12 text-center text-destructive">
            Error loading post detail.
          </p>
        );
    }

  return (
     <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-4 text-center">
        <h1 className="page-gradient-text text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {data?.title}
        </h1>
        <Badge variant="secondary" className="gap-1.5">
          <Calendar className="size-3" />
          {new Date(data!.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Badge>
      </header>

      {data?.image_url && (
        <Card className="overflow-hidden p-0">
          <img
            src={data.image_url}
            alt={data?.title}
            className="aspect-video w-full object-cover"
          />
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground">
            {data?.content}
          </p>
        </CardContent>
      </Card>

      <LikeButton postId={postId} /> 
      <CommentSection postId={postId} /> 
    </article>
  )
}

export default PostDetail
