import { useState } from "react"
import type { Comment } from "./CommentSection"
import { useAuth } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
interface props {

  postId: number,
  comment: (Comment & { children?: Comment[] })

}

const createReply =  async (
    replyContent: string,
    postId: number,
    parentCommentId: number,
    userId?: string,
    author?: string
   ) => {
       
       if(!userId || !author) { 
          throw new Error("You must be logged in to comment")
        }
      const { error } = await supabase
                        .from('comment')
                        .insert({
                            post_id: postId,
                            parent_comment_id: parentCommentId,
                            content: replyContent,
                            user_id: userId,
                            author: author
    
                        })
      if(error) {
        throw new Error(error.message)
      }
    
      return true;
}

const CommentItem = ({postId, comment}: props) => {
  const [showReply, setShowReply] = useState<boolean>(false)
  const [replyText, setReplyText] = useState<string>("")
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {mutate, isPending, isError } = useMutation({
        mutationFn: (replyContent: string) => {
      return createReply(
           replyContent,
           postId,
           comment.id,
           user?.id,
           user?.user_metadata?.user_name)
        },
        onSuccess:() =>  {
          queryClient.invalidateQueries({
            queryKey: ['comments', postId]
               }),
            setReplyText("")
             setShowReply(false)
        }
  })

  const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!replyText) return 
        mutate(replyText)
        
  }

 
  return (
    <div>
      <div>
        <div>
          <span>{comment.author}</span>
          <span>{new Date(comment.created_at).toLocaleString()}</span>
        </div>
        <p>{comment.content}</p>
        <button
          onClick={() =>  setShowReply(prev => !prev)} 
        >
          {
            showReply ? "Cancel" : "Reply"
          }
        </button>
      </div>
      {
        showReply && user && (
          <form onSubmit={handleReplySubmit}>
              
              <textarea 
                  value={replyText}
                  rows={3} 
                  placeholder="write a Reply" 
                  onChange={(e) => setReplyText(e.target.value)}
                />
                      <button
                         type="submit" 
                         className="bg-white rounded-sm p-3 text-black cursor-pointer"
                         >
                        {
                          isPending ? "Replying..." : "Post Reply"
                        }

                      </button>

                       {
                         isError && <p>Error posting a Reply</p>
                      }
                    
                    </form> 
        )
      }
    </div>
  )
}

export default CommentItem