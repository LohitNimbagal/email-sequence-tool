import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createSequence, sequencesQueryOptions, type Sequence } from '@/services/sequence'
import { PlusCircle, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EmailScheduler from '@/components/email-scheduler'

export const Route = createFileRoute('/(protected)/dashboard/')({
    loader: ({ context: { queryClient } }) => {
        return queryClient.ensureQueryData(sequencesQueryOptions)
    },
    component: Dashboard,
})

function NewSequenceDialog() {

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [open, setOpen] = useState(false)
    const [sequenceName, setSequenceName] = useState("")

    const createSequenceMutation = useMutation({
        mutationFn: createSequence,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['sequences'] }) // Refetch sequences
            navigate({ to: '/dashboard/sequences/$sequenceId', params: { sequenceId: data._id } })
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Sequence
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Sequence</DialogTitle>
                    <DialogDescription>Set up a new email sequence for your campaign.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSequence}>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="sequenceName" className="block mb-2 text-sm font-medium text-gray-900">
                            Sequence Name
                        </Label>
                        <Input
                            id="sequenceName"
                            type="text"
                            value={sequenceName}
                            onChange={(e) => setSequenceName(e.target.value)}
                            placeholder="Enter sequence name"
                            required
                            disabled={createSequenceMutation.isPending}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Sequence</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function Dashboard() {

    const navigate = useNavigate()
    const sequencesQuery = useSuspenseQuery(sequencesQueryOptions)

    const sequences = sequencesQuery.data as Sequence[]

    const [searchTerm, setSearchTerm] = useState("")

    // Sort and filter sequences
    const filteredSequences = sequences
        .filter((sequence) => sequence.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="container mx-auto p-6">
            <Tabs defaultValue="sequences" className="w-full">

                <TabsList className="grid w-60 grid-cols-2 mb-8">
                    <TabsTrigger value="sequences">Sequences</TabsTrigger>
                    <TabsTrigger value="scheduler">Email Scheduler</TabsTrigger>
                </TabsList>

                {/* Sequences Tab */}
                <TabsContent value="sequences" className="space-y-6">
                    {/* Sequences Table */}
                    <Card>
                        <CardHeader className="pb-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <CardTitle>All Sequences</CardTitle>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search sequences..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <NewSequenceDialog />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredSequences.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No sequences found. Try adjusting your search.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredSequences.map((sequence) => (
                                        <Card
                                            key={sequence._id}
                                            className="hover:shadow-md transition-shadow duration-200"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg font-medium truncate">
                                                        {sequence.name}
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        onClick={() => navigate({
                                                            to: '/dashboard/sequences/$sequenceId',
                                                            params: { sequenceId: sequence._id }
                                                        })}
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Scheduler Tab */}
                <TabsContent value="scheduler">
                    <EmailScheduler />
                </TabsContent>
            </Tabs>
        </div>
    )
}