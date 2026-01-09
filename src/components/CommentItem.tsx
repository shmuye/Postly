import { useState } from "react"
import type { Comment } from "./CommentSection"
import { useAuth } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { ChevronDown, ChevronUp } from "lucide-react"
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
  const [isCollapsed, setIsCollapsed] = useState(true)
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
    <div
      className="pl-4 border-l border-white/10"
    >
      <div
       className="mb-2"
      >
        <div
          className="flex items-center space-x-2"
        >
          <span
            className="text-sm font-bold text-blue-400"
          >{comment.author}</span>
          <span
           className="text-xs text-gray-500"
          >{new Date(comment.created_at).toLocaleString()}</span>
        </div>
        <p
          className="text-gray-300"
        >{comment.content}</p>
        <button
          className="text-blue-500 text-sm mt-1"
          onClick={() =>  setShowReply(prev => !prev)} 
        >
          {
            showReply ? "Cancel" : "Reply"
          }
        </button>
      </div>
      {
        showReply && user && (
          <form 
              onSubmit={handleReplySubmit}
              className="mb-2"
            >
              
              <textarea 
                  value={replyText}
                  rows={3} 
                  placeholder="write a Reply" 
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border border-white/10 bg-transparent p-2 rounded"
                />
                      <button
                         type="submit" 
                         className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                         >
                        {
                          isPending ? "Replying..." : "Post Reply"
                        }

                      </button>

                       {
                         isError && <p className="text-red-500">Error posting a Reply</p>
                      }
                    
                    </form> 
        )
      }
      {
        comment.children && comment.children.length > 0 &&  (
          <div>
            <button
            onClick={() => setIsCollapsed(prev => !prev)}
            title={isCollapsed ? "Hide Replies" : "Show Replies"}
            >{ isCollapsed ? <ChevronUp /> : <ChevronDown />}</button>

            {
              !isCollapsed && (
                <div
                 className="space-y-2"
                >
                  {
                   comment.children.map((child, key) => (
                  <CommentItem key={key}  comment={child} postId={postId}/>
                ))
                  }
                </div>
                )
            }
          </div>
        )
      }
    </div>
  )
}

export default CommentItem