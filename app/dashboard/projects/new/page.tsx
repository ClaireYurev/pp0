import { ProjectForm } from "@/components/ProjectForm"

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create New Project</h1>
      <ProjectForm />
    </div>
  )
}

