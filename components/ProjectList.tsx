import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export type Project = {
  id: string
  projectName: string
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED"
  currency: string
  freelancerId: string
  clientId: string
  createdAt: Date
  projectDescription: string | null
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.projectName}</TableCell>
            <TableCell>
              <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>{project.status}</Badge>
            </TableCell>
            <TableCell>{project.currency}</TableCell>
            <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

