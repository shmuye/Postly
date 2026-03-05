import { Link } from "react-router-dom";
import type { Post } from "./PostList";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Actions from "./Actions";

interface props {
    post: Post;
}
export const PostItem = ({ post }: props) => {
   const [openEditModal, setOpenEditModal] = useState<boolean>(false)
   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
   const [openDropDown, setOpenDropDown] = useState<boolean>(false)
    return (
    <div className="relative group">
       <button
          className="z-50 cursor-pointer absolute right-2 top-4"
          onClick={() => {
            setOpenDropDown(prev => !prev)
          }}
          >
          <MoreVertical className="w-8 h-8 text-white" />
         </button>
      
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="relative w-full md:w-80 md:h-84 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col gap-4 p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
        
        <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-8.75 h-8.75 rounded-full object-cover"
              />
            ) : (
              <div className="w-8.75 h-8.75 rounded-full bg-linear-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-5.5 font-semibold mt-2">
                {post.title}
              </div>
            </div>
          </div>

          
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full object-cover max-h-37.5 mx-auto"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer h-10 w-12.5 px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
            </span>
            <span className="cursor-pointer h-10 w-12.5 px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
    </Link>
    {
          openDropDown && <Actions 
                             setOpenEditModal={setOpenEditModal}
                             setOpenDeleteModal={setOpenDeleteModal}
                             setOpenDropDown={setOpenDropDown}
                          />
         }
        {
          openEditModal && <EditModal
               id={post.id} 
               setOpenEditModal={setOpenEditModal}
               setOpenDropDown={setOpenDropDown}
                  
            />
        }
        {
          openDeleteModal && 
          <DeleteModal 
            id={post.id} 
            setOpenDeleteModal={setOpenDeleteModal}
            setOpenDropDown={setOpenDropDown}
          />
        }
    </div>
  );
}
