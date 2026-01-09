import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


import { supabase } from "../supabase-client"
import CommentItem from "./CommentItem"

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
                          
    if(error) throw new Error(error.message)

    return data as Comment[]
  }
const CommentSection = ({ postId } : props) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState<string>("")
  const userName = user?.user_metadata?.user_name
  const queryClient = useQueryClient()

  const {data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn:() => fetchComments(postId),
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (comment: NewComment) => {
        if(!user) throw new Error("not authenticated")
        return addComment(comment, postId,  user!.id, userName)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ['comments', postId]
        })
    }
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
    <div className="mt-6">
       <h3 className="text-2xl font-semibold mb-4">Comments</h3>
        {
            user ? (
                   <form 
                      onSubmit={handleSubmit}
                      className="mb-4"
                      >
                      <textarea 
                          value={newComment}
                          rows={3} 
                          placeholder="write a comment" 
                          className="w-full border border-white/10 bg-transparent p-2 rounded"
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      <button
                         type="submit" 
                         className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                         >
                        {
                          isPending ? "Posting..." : "Post Comment"
                        }

                      </button>

                       {
                         isError && <p className="text-red-500 mt-2">Error posting a comment</p>
                      }
                    
                    </form> 

                  
            )
            : <p 
             className="mb-4 text-gray-600"
            >You must login to post a comment</p>
        }

        <div  
           className="space-y-4">
        {commentTree.map((comment) => (
          <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection