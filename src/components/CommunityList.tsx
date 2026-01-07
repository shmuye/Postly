import { useQuery } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { Link } from "react-router-dom"

export interface Community {
    id: number,
    name: string,
    description: string,
    created_at: string,
} 

export const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase
                     .from('community')
                     .select('*')
                     .order('created_at', {ascending: false})
    if (error) throw new Error("Error fetching communities")
    return data as Community[]
}
const CommunityList = () => {

    const { data, error, isLoading} = useQuery<Community[], Error>({
        queryFn: fetchCommunities ,
        queryKey: ['communities']
    })

    if(isLoading) return <div>Loading Communities...</div>
    if(error) return <div>{error.message}</div>
  return (
    <div>
        {
            data?.map((community, key) => {
                return <div key={key}>
                     <Link to="community">
                         {
                            community.name
                         }
                     </Link>
                     {
                        <p>{community.description}</p>
                     }
                </div>
            })
        }
    </div>
  )
}

export default CommunityList