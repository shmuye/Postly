import React, { type ChangeEvent } from 'react'
import { useState } from 'react';
import { supabase } from '../supabase-client';
import  { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { fetchCommunities, type Community } from './CommunityList';
import { useNavigate } from 'react-router-dom';


interface PostInput {
    title : string;
    content: string ;
    avatar_url: string | null;
    community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File | null) => {
    
    const filePath = `${post.title}-${Date.now()}-${imageFile?.name}`;

    const { error: uploadError } = await supabase.storage
        .from('post_images')
        .upload(filePath, imageFile!);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: publicUrlData } =  supabase.storage.from('post_images').getPublicUrl(filePath);
    const { data, error } = await supabase.from('posts').insert({...post, image_url: publicUrlData.publicUrl});

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
        if(!selectedFile) return;
        mutate({post: { 
               title, content , 
               avatar_url: user?.user_metadata.avatar_url || null,
               community_id: communityId
            },
            imageFile: selectedFile});
    }   

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }
  
    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setCommunityId(value ? Number(value) : null);
    }
    

  return (
    <form onSubmit={handleSubmit}  className="max-w-2xl mx-auto space-y-4">
        <div>
            <label 
                htmlFor='title'
                className="block mb-2 font-medium">Title </label>
            <input 
               id='title'
               type="text" 
               placeholder="Post Title" 
               onChange={(e) => setTitle(e.target.value)}
               className="w-full border border-white/20 bg-transparent p-2 rounded"/>
            </div>
        <div>
            <label
                htmlFor='content'
                className="block mb-2 font-medium"
                >Post Content</label>
            <textarea 
               onChange={(e) => setContent(e.target.value)}
               id='content'
               placeholder="Post Content" 
               className="w-full border border-white/20 bg-transparent p-2 rounded" 
               rows={5}
               />
        </div>
        <div>
            <label htmlFor="community">Select Community</label>
            <select 
               name="" 
               id="community"
               onChange={handleCommunityChange}>
                <option value={""}>
                   ---Choose Community---
                </option>
                {
                    communities?.map((community) => (
                        <option 
                        key={community.id}
                        value={community.id}>
                            {community.name}
                        </option>
                    ))
                 }

            </select>
        </div>
        <div>
            <label
                htmlFor='image'
                className="block mb-2 font-medium"
            >Upload Image</label>
            <input
               type='file'
               onChange={handleFileChange}
               id='image'
               accept='image/*'
               required
               className="w-full text-gray-200"
             />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            {
                isPending ? 'Creating' : 'Create Post'
            }
        </button>
        {
            isError && <p>Error Creating Post</p>
        }
    </form>
  )
}

export default CreatePost