"use client"

import { useState } from "react"
import Link from "next/link"

interface Project {
  id: number
  projectName: string
  status: string
}

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [localProjects, setLocalProjects] = useState(projects)

  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setLocalProjects(localProjects.filter((project) => project.id !== id))
      } else {
        console.error("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {localProjects.map((project) => (
        <li key={project.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
          <div className="w-full flex items-center justify-between p-6 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="text-gray-900 text-sm font-medium truncate">{project.projectName}</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                  {project.status}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <Link
                  href={`/projects/${project.id}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  View
                </Link>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <button
                  onClick={() => deleteProject(project.id)}
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-700 font-medium border border-transparent rounded-br-lg hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

