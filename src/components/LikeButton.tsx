import { useMutation } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


interface props {
    postId : number;
}

const vote = async (voteValue: number, postId: number, userId: number) => {
   const { error } = await supabase.from('votes').insert({
    post_id: postId,
    user_id: userId,
    vote: voteValue
   })

   if(error) {
    throw new Error(error.message);
   }
}

        

const LikeButton = ({ postId }: props) => {

    const { user } = useAuth();
    
    const userId = user?.user_metadata.user_id; 

   
    const { mutate } = useMutation({
        mutationFn: (voteValue: number ) => {
            if(!user) throw new Error("User doesn't exist");
            return vote(voteValue, postId, userId) 

        } 
    })
           
  return (
    <div>
        {" "}
        <button
           onClick={() => mutate(1)}
        >
            <ThumbsUp />
        </button>
        <button
          onClick={() => mutate(-1)}
        >
            <ThumbsDown />
        </button>

    </div>
  )
}

export default LikeButton