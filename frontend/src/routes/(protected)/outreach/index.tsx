import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { createSequence, sequencesQueryOptions, type Sequence } from '@/services/sequence'


export const Route = createFileRoute('/(protected)/outreach/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(sequencesQueryOptions)
  },
  component: Sequence,
})

function Sequence() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sequencesQuery = useSuspenseQuery(sequencesQueryOptions)

  const sequences = sequencesQuery.data as Sequence[]

  const [open, setOpen] = useState(false)
  const [sequenceName, setSequenceName] = useState("")

  const createSequenceMutation = useMutation({
    mutationFn: createSequence,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sequences'] }) // Refetch sequences
      navigate({ to: '/outreach/sequences/$sequenceId', params: { sequenceId: data._id } })
      setSequenceName("")
      setOpen(false)
    },
    onError: (error) => {
      console.error("Error creating sequence:", error)
    },
  })

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault()
    createSequenceMutation.mutate(sequenceName)
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Outreach Sequences</h1>
          <p className="text-gray-600">
            Create/Manage your sequences with automated emails & timely tasks.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <span>Create New Sequence</span>
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sequence</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateSequence}>
            <div>
              <Label htmlFor="sequenceName" className="block mb-2 text-sm font-medium text-gray-900">
                Sequence Name
              </Label>
              <Input
                id="sequenceName"
                type="text"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
                className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sequence name"
                required
                disabled={createSequenceMutation.isPending}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={createSequenceMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSequenceMutation.isPending || !sequenceName.trim()}>
                {createSequenceMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>A list of your outreach sequences.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Schedule Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sequences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No sequences found</TableCell>
            </TableRow>
          ) : (
            sequences.map((seq: Sequence) => (
              <TableRow key={seq._id}>
                <TableCell className="font-medium">
                  <Link
                    to="/outreach/sequences/$sequenceId"
                    params={{ sequenceId: seq._id }}
                  >
                    {seq.name}
                  </Link>
                </TableCell>
                <TableCell>{seq.status ?? "-"}</TableCell>
                <TableCell>{seq.scheduleTime ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => navigate({
                      to: '/outreach/sequences/$sequenceId',
                      params: { sequenceId: seq._id }
                    })}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}