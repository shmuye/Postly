import { useMutation, useQuery } from '@tanstack/react-query';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase-client';


interface props {
    postId : number;
}
 
interface Vote {
     id: number,
     post_id: number,
     user_id: string,
     vote: number
}

const vote = async (voteValue: number, postId: number, userId: string) => {

  const { data: existingVote } = await supabase
     .from('votes')
     .select("*")
     .eq("post_id", postId)
     .eq('user_id', userId)
     .maybeSingle()

   if(existingVote) {
    if(existingVote.vote === voteValue){
        const { error } = await supabase
                   .from('votes')
                   .delete()
                   .eq('id', existingVote.id)
        if(error){
            throw new Error(error.message)
        }

    }else {
         const { error } = await supabase
                .from('votes')
                .update({ vote : voteValue})
                .eq('id', existingVote.id)

        if(error) throw new Error(error.message)
    }
   }else {

    const { error } = await supabase.from('votes').insert({
          post_id: postId,
          user_id: userId,
          vote: voteValue
   })

   if(error) {
      throw new Error(error.message);
   }

   }
}

const fetchPosts =  async (postId: number): Promise<Vote[]> => {
    const {data , error } = await supabase
        .from('votes')
        .select("*")
        .eq('post_id', postId)
        

    if(error) throw new Error(error.message)
    
    return data as Vote[]
}



const LikeButton = ({ postId }: props) => {

    const { user } = useAuth();
    const queryClient = useQueryClient()

    const { data: votes, isLoading, error  } = useQuery<Vote[], Error>({
         queryKey: ['votes', postId],
         queryFn: () => fetchPosts(postId)
    })
    
    const { mutate } = useMutation({
        mutationFn: (voteValue: number ) => {
            if(!user) throw new Error("User doesn't exist");
            return vote(voteValue, postId, user?.id) 

        } ,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['votes', postId]
            })
        }

    })

    if(isLoading) {
        return (
          <div className="flex gap-3">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        )
    }
    if(error) {
        return <p className="text-sm text-destructive">Error: {error.message}</p>
    }

  const likes = votes?.filter((v) => v.vote === 1).length || 0
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0

  return (
    <div className="flex flex-wrap items-center gap-3">
        <Button
           variant="outline"
           className="gap-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
           onClick={() => mutate(1)}
        >
            <ThumbsUp className="size-4" />
            {likes}
        </Button>
        <Button
           variant="outline"
           className="gap-2 border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
           onClick={() => mutate(-1)}
        >
            <ThumbsDown className="size-4" />
            {dislikes}
        </Button>
    </div>
  )
}

export default LikeButton
