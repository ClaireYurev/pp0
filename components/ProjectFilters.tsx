"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useEffect, useState } from "react"

export function ProjectFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }
    router.push(`/dashboard/projects?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  function onStatusChange(status: string) {
    const params = new URLSearchParams(searchParams)
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    router.push(`/dashboard/projects?${params.toString()}`)
  }

  function onSortChange(sort: string) {
    const params = new URLSearchParams(searchParams)
    if (sort) {
      params.set("sort", sort)
    } else {
      params.delete("sort")
    }
    router.push(`/dashboard/projects?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />
      <Select onValueChange={onStatusChange} defaultValue={searchParams.get("status") || ""}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="PLANNING">Planning</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onSortChange} defaultValue={searchParams.get("sort") || "latest"}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest Updated</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

