import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";

type DeleteModalProps = {
  id: number;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
};
 
const deletePost = async (id: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  const rows = Array.isArray(data) ? data : (data ? [data] : []);
  const deletedCount = rows.length;
  console.log("deleted post", { rows, error, deletedCount });

  if (deletedCount === 0) {
    throw new Error("No post was deleted");
  }

  return rows;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  id,
  setOpenDeleteModal,
  setOpenDropDown,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation<any[], any, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpenDeleteModal(false);
      setOpenDropDown(false);
      toast.success("Post deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete post")
    }
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpenDeleteModal(false);
      setOpenDropDown(false);
    }
  };
 
  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {isError && (
          <p className="text-sm text-destructive">
            Failed to delete the post.
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate(id)}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
