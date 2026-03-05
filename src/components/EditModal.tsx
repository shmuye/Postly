import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { Post } from "./PostList";
import { useState } from "react";

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
    
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-[#181b20] w-[90%] max-w-lg p-6 rounded-xl border border-gray-700 text-white">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setOpenEditModal(false);
                setOpenDropDown(false);
              }}
              className="px-4 py-2 bg-gray-600 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded cursor-pointer"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>

          {isError && (
            <p className="text-red-500 text-sm">Error updating post</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditModal


