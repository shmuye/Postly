import { Link } from "react-router-dom";
import type { Post } from "./PostList";

interface props {
    post: Post;
}
export const PostItem = ({ post }: props) => {
  return (
        <div>
            <div />
        <Link to={`/posts`} className="block mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
         <div>
            <div>
                <div />
                <div>
                    <div></div>
                </div>
            </div>
         </div>
         <div>
            <img src={post.image_url} alt={post.title}/>
         </div>
    </Link> 
    </div> 
    
  )
}
