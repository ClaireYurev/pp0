"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function QuickActionFAB() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onSelect={() => {
              /* TODO: Open Invoice Form */
            }}
          >
            New Invoice
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              /* TODO: Open Estimate Form */
            }}
          >
            New Estimate
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              /* TODO: Open Deposit Request Form */
            }}
          >
            New Deposit Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

