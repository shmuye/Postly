import React, { type ChangeEvent } from 'react'
import { useState } from 'react';
import { supabase } from '../supabase-client';
import  { useMutation } from '@tanstack/react-query';


interface PostInput {

    title : string;
    content: string ;
}

const createPost = async (post: PostInput, imageFile: File | null) => {
    
    const filePath = `${post.title}-${Date.now()}-${imageFile?.name}`;

    const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile!);

    if (uploadError) {
        throw new Error(uploadError.message);
    }
    const { data, error } = await supabase.from('posts').insert([post]);

    if (error) {
        throw new Error(error.message);
    }  
    
    return data;    

}

const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { mutate } = useMutation({
        mutationFn: (data: {post: PostInput, imageFile: File}) => {
            if (!data.imageFile) {
                throw new Error("No file selected");
            }
            return createPost(data.post, data.imageFile);
        }
    }); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedFile) return;
        mutate({post: { title, content }, imageFile: selectedFile});
    }   

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>Title </label>
            <input 
               id='title'
               type="text" 
               placeholder="Post Title" 
               onChange={(e) => setTitle(e.target.value)}
               className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-gray-100"/>
            </div>
        <div>
            <label>Post Content</label>
            <textarea 
               onChange={(e) => setContent(e.target.value)}
               id='content'
               placeholder="Post Content" 
               className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-gray-100 h-40"></textarea>
        </div>
        <div>
            <label>Upload Image</label>
            <input
               type='file'
               onChange={handleFileChange}
               id='image'
               required
             />
        </div>

        <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">Create Post</button>
    </form>
  )
}

export default CreatePost