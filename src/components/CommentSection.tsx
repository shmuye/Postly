import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import CommentItem from "./CommentItem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

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
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    )
  }

  if(error) {
    return <p className="text-destructive">{error.message}</p>
  }

  const commentTree = comments ? buildCommentTree(comments) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="size-5 text-primary" />
          Comments
          {comments && comments.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              rows={3}
              placeholder="Write a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Posting..." : "Post Comment"}
            </Button>
            {isError && (
              <p className="text-sm text-destructive">Error posting a comment</p>
            )}
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            You must sign in to post a comment.
          </p>
        )}

        <div className="space-y-4">
          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentSection
