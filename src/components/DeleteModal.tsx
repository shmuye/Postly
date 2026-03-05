import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

type DeleteModalProps = {
  id: number;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
};

const deletePost = async (id: number) => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  id,
  setOpenDeleteModal,
  setOpenDropDown,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpenDeleteModal(false);
      setOpenDropDown(false);
    },
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-[90%] max-w-md bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-2xl p-6 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">Delete Post</h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        {isError && (
          <p className="text-red-400 text-sm mb-3">
            Failed to delete the post.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDeleteModal(false);
              setOpenDropDown(false);
            }}
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              mutate(id);
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;