import Link from "next/link"

interface Project {
  id: number
  projectName: string
  status: string
}

export default function ProjectsOverview({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Active Projects</h3>
        <div className="mt-5 space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{project.projectName}</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    project.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href="/projects" className="font-medium text-indigo-600 hover:text-indigo-500">
            View all projects
          </Link>
        </div>
      </div>
    </div>
  )
}

