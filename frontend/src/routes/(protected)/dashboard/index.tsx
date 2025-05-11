import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createSequence, sequencesQueryOptions, type Sequence } from '@/services/sequence'
import { Search, LayoutGrid, Plus, Calendar, Clock, Edit } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useState } from 'react'
import { format } from 'date-fns'
import EmailScheduler from '@/components/email-scheduler'

export const Route = createFileRoute('/(protected)/dashboard/')({
    loader: ({ context: { queryClient } }) => {
        return queryClient.ensureQueryData(sequencesQueryOptions)
    },
    component: Dashboard,
})

const formSchema = z.object({
    sequenceName: z.string().min(1, "Sequence name is required"),
})

function NewSequenceDialog() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sequenceName: "",
        },
    })

    const createSequenceMutation = useMutation({
        mutationFn: createSequence,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['sequences'] })
            navigate({ to: '/dashboard/sequences/$sequenceId', params: { sequenceId: data._id } })
            form.reset()
            setOpen(false)
        },
        onError: (error) => {
            console.error("Error creating sequence:", error)
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createSequenceMutation.mutate(values.sequenceName)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                    <Plus className="h-4 w-4" />
                    New Sequence
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Sequence</DialogTitle>
                    <DialogDescription>Set up a new email sequence for your campaign.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="sequenceName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sequence Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter sequence name" 
                                            {...field}
                                            className="w-full border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            disabled={createSequenceMutation.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-gray-200 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={createSequenceMutation.isPending}
                            >
                                {createSequenceMutation.isPending ? "Creating..." : "Create Sequence"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

interface SequenceCardProps {
    sequence: Sequence;
    onClick: () => void;
}

function SequenceCard({ sequence, onClick }: SequenceCardProps) {

    return (
        <div
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow transition-all duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                    {sequence.name}
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </div>

            <div className="space-y-2 text-sm">
                {/* <div className="flex items-center text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{emailCount} emails</span>
                </div> */}

                <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {format(sequence.createdAt, 'MMM d, yyyy')}</span>
                </div>

                <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Updated: {format(sequence.updatedAt, 'MMM d, yyyy')}</span>
                </div>
            </div>
        </div>
    )
}

export default function Dashboard() {

    const navigate = useNavigate()
    const sequencesQuery = useSuspenseQuery(sequencesQueryOptions)
    const sequences = sequencesQuery.data as Sequence[]

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [activeView, setActiveView] = useState<"sequences" | "scheduler">("sequences")

    // Filter sequences
    const filteredSequences = sequences
        .filter(sequence => sequence.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="w-full max-w-7xl">
            {/* Header with View Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="bg-white rounded-md shadow-sm border border-gray-100 p-0.5 flex">
                    <button
                        className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${activeView === "sequences"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                        onClick={() => setActiveView("sequences")}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span>Sequences</span>
                    </button>
                    <EmailScheduler />
                </div>
            </div>

            <div className="space-y-6">
                {/* Search and Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search sequences..."
                            className="pl-8 h-9 border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <NewSequenceDialog />
                </div>

                {/* Sequences Grid */}
                {filteredSequences.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <div className="mx-auto w-14 h-14 bg-gray-50 flex items-center justify-center rounded-full mb-3">
                            <LayoutGrid className="h-7 w-7 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No sequences found</h3>
                        <p className="text-gray-500 mt-1 max-w-md mx-auto text-sm">
                            {searchTerm ? "Try adjusting your search terms." : "Create your first sequence to get started."}
                        </p>
                        {!searchTerm && (
                            <div className="mt-5">
                                <NewSequenceDialog />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSequences.map((sequence) => (
                            <SequenceCard
                                key={sequence._id}
                                sequence={sequence}
                                onClick={() => navigate({
                                    to: '/dashboard/sequences/$sequenceId',
                                    params: { sequenceId: sequence._id }
                                })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}