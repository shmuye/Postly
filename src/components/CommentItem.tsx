import { useState } from "react"
import type { Comment } from "./CommentSection"
import { useAuth } from "../contexts/AuthContext"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase-client"

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

  const initials = comment.author?.charAt(0).toUpperCase() ?? "?"

  return (
    <div className="border-l-2 border-primary/20 pl-4">
      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/15 text-xs text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-semibold text-primary">
              {comment.author}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {comment.content}
        </p>
        <Button
          variant="ghost"
          size="xs"
          className="h-auto px-1 text-primary"
          onClick={() => setShowReply(prev => !prev)}
        >
          {showReply ? "Cancel" : "Reply"}
        </Button>
      </div>

      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-3 space-y-2">
          <Textarea
            value={replyText}
            rows={2}
            placeholder="Write a reply..."
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Replying..." : "Post Reply"}
          </Button>
          {isError && (
            <p className="text-sm text-destructive">Error posting a reply</p>
          )}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="xs"
            className="gap-1 text-muted-foreground"
            onClick={() => setIsCollapsed(prev => !prev)}
          >
            {isCollapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
            {isCollapsed ? "Show" : "Hide"} {comment.children.length} {comment.children.length === 1 ? "reply" : "replies"}
          </Button>

          {!isCollapsed && (
            <div className="mt-2 space-y-3">
              {comment.children.map((child) => (
                <CommentItem key={child.id} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentItem
