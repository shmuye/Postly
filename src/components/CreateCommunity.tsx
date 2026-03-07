import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


interface CommunityInput {
  name: string,
  description: string
}

const createCommunity = async (community: CommunityInput) => {
 
  const {data, error} = await supabase
                      .from('community')
                      .insert(community)
  if(error) throw new Error(error.message)
  
  return data
}

const CreateCommunity = () => {

  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()


  const {mutate, isPending, isError} = useMutation({
           mutationFn: createCommunity ,
           onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['communities']
            })
           navigate('/communities')
         }

  })

  const handleSubmit = (e: React.FormEvent) => {
         e.preventDefault()
         mutate({ name, description } )
  }    
  return (
    <form 
       onSubmit={handleSubmit}
       className="max-w-5xl mx-auto space-y-4"
       >
      <h2
         className="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-6 bg-linear-to-r from-green-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap"
      >
         Create New Community
      </h2>

      <div>
        <label
         className="block mb-2 font-medium"
        >Community Name</label>
        <input 
            type="text"  
            id="name" 
            required
            className="w-full border border-white/20 bg-transparent p-2 rounded"
            onChange={(e) => setName(e.target.value)} 
          />
      </div>

       <div>
        <label
         className="block mb-2 font-medium"
        >Description</label>
        <textarea 
             id="description" 
             required 
             rows={3}
             className="w-full border border-white/20 bg-transparent p-2 rounded"
             onChange={(e) => setDescription(e.target.value)} 
          />
      </div>

      <button
       type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >{isPending ? "Creating" : "Create Community"}</button>
      {
        isError && <div>Error Creating Community</div>
      }
    </form>
  )
}

export default CreateCommunity