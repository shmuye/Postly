import PostDetail from "../components/PostDetail"
import { useParams } from "react-router-dom"

const PostPage = () => {
    const { id } = useParams<{id: string}>()
  return (
    <PostDetail postId={Number(id)} />
  )
}

export default PostPage
