import { Spinner } from "@/components/ui/spinner"

const Loader = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center py-12">
      <Spinner className="size-8 text-primary" />
    </div>
  )
}

export default Loader
