import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from "react"
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

interface Sequence {
  _id: string;
  name: string;
  status?: string;
  scheduleTime?: string;
}

export const Route = createFileRoute('/(protected)/outreach/')({
  component: Sequence,
})

function Sequence() {

  const [open, setOpen] = useState(false)
  const [sequenceName, setSequenceName] = useState("")
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const response = await fetch('http://localhost:8080/sequences', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sequences');
        }

        const data: Sequence[] = await response.json();
        setSequences(data);
      } catch (error) {
        console.error('Error fetching sequences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSequences();
  }, []);

  const handleCreateSequence = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/sequences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token here if required
        },
        credentials: 'include',
        body: JSON.stringify({ name: sequenceName })
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to create sequence');
      }

      // Reset form and close dialog
      setSequenceName("")
      setOpen(false)
    } catch (error) {
      console.error('Error creating sequence:', error)
      // Add error handling (e.g., show toast notification)
    } finally {
      setLoading(false)
    }
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sequence</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateSequence}>
            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-900">
                Sequence Name
              </Label>
              <Input
                type="text"
                value={sequenceName}
                onChange={(e) => setSequenceName(e.target.value)}
                className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter sequence name"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Loading sequences...</TableCell>
            </TableRow>
          ) : sequences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No sequences found</TableCell>
            </TableRow>
          ) : (
            sequences.map((seq: Sequence) => (
              <TableRow key={seq._id}>
                <TableCell className="font-medium">
                  <Link
                    to={`/outreach/sequences/$sequenceId`}
                    params={{ sequenceId: seq._id }}
                  >
                    {seq.name}
                  </Link>
                </TableCell>
                <TableCell>{seq.status ?? "-"}</TableCell>
                <TableCell>{seq.scheduleTime ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <a href="#" className="text-blue-600 hover:underline">Edit</a>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}