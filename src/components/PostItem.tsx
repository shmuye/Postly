import { Link } from "react-router-dom";
import type { Post } from "./PostList";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import { Heart, MessageCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface props {
    post: Post;
}

export const PostItem = ({ post }: props) => {
   const [openEditModal, setOpenEditModal] = useState<boolean>(false)
   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

    return (
    <div className="relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute right-2 top-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">
                <MoreVertical className="size-4" />
                <span className="sr-only">Post actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenEditModal(true)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setOpenDeleteModal(true)}>
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link to={`/post/${post.id}`} className="block">
          <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
            <Avatar size="sm">
              <AvatarImage src={post.avatar_url} alt="" />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {post.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="line-clamp-2 flex-1 pr-8 text-base font-semibold leading-snug">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </CardContent>

          <CardFooter className="justify-center gap-4 border-t bg-muted/30 py-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Heart className="size-3.5 text-rose-400" />
              {post.like_count ?? 0}
            </Badge>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <MessageCircle className="size-3.5 text-sky-400" />
              {post.comment_count ?? 0}
            </Badge>
          </CardFooter>
        </Link>
      </Card>

      {openEditModal && (
        <EditModal
          id={post.id}
          post={post}
          setOpenEditModal={setOpenEditModal}
          setOpenDropDown={() => {}}
        />
      )}
      {openDeleteModal && (
        <DeleteModal
          id={post.id}
          setOpenDeleteModal={setOpenDeleteModal}
          setOpenDropDown={() => {}}
        />
      )}
    </div>
  );
}
