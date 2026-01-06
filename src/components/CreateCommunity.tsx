import { useMutation } from "@tanstack/react-query"
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


  const {mutate, isPending, isError} = useMutation({
           mutationFn: createCommunity ,
           onSuccess: () => {
           navigate('/communities')
         }

  })

  const handleSubmit = (e: React.FormEvent) => {
         e.preventDefault()
         mutate({ name, description } )
  }    
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Community</h2>

      <div>
        <label>Community Name</label>
        <input 
            type="text"  
            id="name" 
            required
            onChange={(e) => setName(e.target.value)} 
          />
      </div>

       <div>
        <label>Description</label>
        <textarea 
             id="description" 
             required rows={3}
             onChange={(e) => setDescription(e.target.value)} 
          />
      </div>

      <button>{isPending ? "Creating" : "Create Community"}</button>
      {
        isError && <div>Error Creating Community</div>
      }
    </form>
  )
}

export default CreateCommunity