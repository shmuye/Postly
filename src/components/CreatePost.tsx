import React, { type ChangeEvent } from 'react'
import { useState } from 'react';
import  { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { fetchCommunities, type Community } from './CommunityList';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';


interface PostInput {
    title : string;
    content: string ;
    avatar_url: string | null;
    community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error("You must be logged in to create a post");
    }

    const filePath = `${post.title}-${Date.now()}-${imageFile?.name}`;

    const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: publicUrlData } =  supabase.storage.from('post_images').getPublicUrl(filePath);
    const { data, error } = await supabase.from('posts').insert({
        title: post.title,
        content: post.content,
        avatar_url: post.avatar_url,
        community_id: post.community_id,
        user_id: user.id,
        image_url: publicUrlData.publicUrl,
    }).select().single();

    if (error) {
        throw new Error(error.message);
    }  

    return data;    

}

const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [communityId, setCommunityId] = useState<number | null>(null);

    const { user } = useAuth();
   
    const navigate = useNavigate()

    const { data: communities} = useQuery<Community[], Error>({
        queryFn: fetchCommunities ,
        queryKey: ['communities']
    })

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data: {post: PostInput, imageFile: File}) => {
            if (!data.imageFile) {
                throw new Error("No file selected");
            }
            return createPost(data.post, data.imageFile);
        },

        onSuccess: () => {
            navigate('/')
        }
    }); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedFile || !user) return;
        mutate({post: { 
               title, content , 
               avatar_url: user.user_metadata.avatar_url || null,
               community_id: communityId,
            },
            imageFile: selectedFile});
    }   

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }
    

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>New Post</CardTitle>
        <CardDescription>Share something with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="community">Community</Label>
            <Select
              onValueChange={(value) => setCommunityId(Number(value))}
            >
              <SelectTrigger id="community" className="w-full">
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent>
                {communities?.map((community) => (
                  <SelectItem key={community.id} value={String(community.id)}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                onChange={handleFileChange}
                id="image"
                accept="image/*"
                required
                className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground"
              />
              {selectedFile && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ImagePlus className="size-3.5" />
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Post'}
          </Button>

          {isError && (
            <p className="text-sm text-destructive">Error creating post</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default CreatePost
