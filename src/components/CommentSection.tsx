import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMutation, useQuery } from "@tanstack/react-query"

import { supabase } from "../supabase-client"

interface props {
    postId: number
}

interface NewComment {
  content: string;
  parent_comment_id?: string | null;
}

export interface Comment {
  id: number,
  post_id: number,
  user_id: string,
  parent_comment_id: number | null,
  content: string,
  created_at: string,
  author: string,
}
const addComment =  async (
  comment: NewComment, 
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

  return true;
}

 const fetchComments =  async (postId: number): Promise<Comment[]> => {
     const {data ,  error } =  await supabase
                          .from('comment')
                          .select('*')
                          .eq('post_id', postId)
                          .order('created_at', {ascending: true})
                          .single()
    if(error) throw new Error(error.message)

    return data as Comment[]
  }
const CommentSection = ({ postId } : props) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState<string>("")
  const userName = user?.user_metadata?.user_name

  const {data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: fetchComments,
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (comment: NewComment) => {
        return addComment(comment, postId,  user!.id, userName)
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

const buildCommentTree = (
  flatComments: Comment[]
): (Comment & { children?: Comment[] })[] => {

  const map = new Map<number, Comment & { children: Comment[] }>()
  const roots: (Comment & { children?: Comment[] })[] = []

  flatComments.forEach((comment) => {
    map.set(comment.id, { ...comment, children: [] })
  })

  flatComments.forEach((comment) => {
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id)
      if (parent) {
        parent.children.push(map.get(comment.id)!)
      }
    } else {
      roots.push(map.get(comment.id)!)
    }
  })

  return roots
}


  if(isLoading) {
    return <div>Loading comments</div>
  }

  if(error) {
    return <div>{error.message} </div>
  }

  const commentTree = comments ? buildCommentTree(comments) : []
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
                      <button
                         type="submit" 
                         className="bg-white rounded-sm p-3 text-black cursor-pointer"
                         >
                        {
                          isPending ? "Posting..." : "Post Comment"
                        }

                      </button>

                       {
                         isError && <p>Error posting a comment</p>
                      }
                    
                    </form> 

                  
            )
            : <p>You must login to post a comment</p>
        }

         {/* <div>
          { commentTree }
        </div>  */}
    </div>
  )
}

export default CommentSection