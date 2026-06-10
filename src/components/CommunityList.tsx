import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

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

    if(isLoading) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      )
    }

    if(error) {
      return (
        <p className="py-8 text-center text-destructive">
          Error: {error.message}
        </p>
      )
    }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
        {data?.map((community) => (
          <Link key={community.id} to={`/community/${community.id}`}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="size-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{community.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 text-sm">
                  {community.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  )
}

export default CommunityList
