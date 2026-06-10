import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase-client";

type EditModalProps = {
    id: number, 
    post: Post
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

type updatePostRequest = Partial<Post>

const updatePost = async ({id, data}: {id: number, data:updatePostRequest}) => {
      const { error } = await supabase
                       .from('posts')
                       .update(data)
                       .eq('id',id)
      if(error) throw new Error(error.message)
}

const EditModal: React.FC<EditModalProps> = ({
    id,
    post,
    setOpenEditModal,
    setOpenDropDown
}) => {
    const queryClient = useQueryClient()

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const { mutate, isPending, isError } = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['posts']
            })
            setOpenEditModal(false);
            setOpenDropDown(false)
        }
    })

    const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      id,
      data: {
        title,
        content,
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpenEditModal(false);
      setOpenDropDown(false);
    }
  };
    
  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update your post title and content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>

          {isError && (
            <p className="text-sm text-destructive">Error updating post</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditModal
