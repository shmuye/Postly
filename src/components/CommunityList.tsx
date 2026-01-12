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

    if(isLoading) return <div className="text-center py-4">Loading Communities...</div>
    if(error) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>
  return (
    <div
       className="max-w-5xl mx-auto space-y-4"
    >
        {
            data?.map((community) => {
                return <div 
                          key={community.id}
                          className="border border-white/20 p-4 rounded hover:-translate-y-1 transition transform"
                          >
                     <Link 
                        to={`/community/${community.id}`}
                        className="text-2xl font-bold text-blue-500 hover:underline"
                        >
                         {
                            community.name
                         }
                     </Link>
                     {
                        <p
                          className="text-gray-400 mt-2"
                        >{community.description}</p>
                     }
                </div>
            })
        }
    </div>
  )
}

export default CommunityList