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
  const {} = await supabase
                    .from('comment')
                    .insert({
                        parent_comment_id,
                        content,
                        user_id: userId,
                        post_id: postId,

                    })
}
const CommentSection = ({ postId } : props) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState<string>("")
  const queryClient = useQueryClient()
  const userName = user?.user_metadata?.user_name

  const { mutate } = useMutation({
    mutationFn: (newComment: Comment) => {
        addComment(newComment, postId, user?.id, userName)
    },
    onSuccess: () => {

    }
    
  })
  const handleSubmit = (e: React.FormEvent) => {
         e.preventDefault()
         if(!newComment) return 
         mutate
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
                      <button type="submit" >Post Comment</button>
                   </form> 
            )
            : <p>You must login to post a comment</p>
        }
    </div>
  )
}

export default CommentSection