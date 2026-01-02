import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../supabase-client"

interface props {
    postId: number
}

interface Comment {
  content: string;
  parent_comment_id?: string | null;
}
const addComment =  async (
  comment: Comment, 
  postId: number,
  userId: string, 
  author: string ) => {
    if(!userId || !author) { 
      throw new Error("You must be logged in to comment")
    }
  const { error } = await supabase
                    .from('comment')
                    .insert({
                        post_id: postId,
                        parent_comment_id: comment.parent_comment_id ?? null,
                        content: comment.content,
                        user_id: userId,
                        author: author

                    })
  if(error) {
    throw new Error(error.message)
  }
}
const CommentSection = ({ postId } : props) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState<string>("")
  const queryClient = useQueryClient()
  const userName = user?.user_metadata?.user_name

  const { mutate, isPending, error } = useMutation({
    mutationFn: (comment: Comment) => {
        addComment(comment, postId,  user!.id, userName)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
         e.preventDefault()
         if(!newComment) return 

         mutate({
          content: newComment,
          parent_comment_id: null,
         })

         setNewComment("")
  }

  if(isPending) {
    return <div>Loading comment</div>
  }

  if(error) {
    return <div>{error.message} </div>
  }
  return (
    <div>
        {
            user ? (
                   <form onSubmit={handleSubmit}>
                      <textarea 
                          value={newComment}
                          rows={3} 
                          placeholder="write a comment" 
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      <button type="submit" >
                        {
                          isPending ? "Posting" : "Post Comment"
                        }

                      </button>

                       {
                         error && <p>Error posting a comment</p>
                      }
                    
                    </form> 

                  
            )
            : <p>You must login to post a comment</p>
        }
    </div>
  )
}

export default CommentSection