import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase-client"


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
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create Community</CardTitle>
        <CardDescription>Start a new space for people to connect</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              type="text"
              id="name"
              required
              placeholder="e.g. Web Developers"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              rows={3}
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Community"}
          </Button>

          {isError && (
            <p className="text-sm text-destructive">Error creating community</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateCommunity
