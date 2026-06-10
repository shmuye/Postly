import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

const PageHeader = ({ title, description, className }: PageHeaderProps) => {
  return (
    <header className={cn("mb-8 space-y-2 text-center", className)}>
      <h1 className="page-gradient-text text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </header>
  )
}

export default PageHeader
