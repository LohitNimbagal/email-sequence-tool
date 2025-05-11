import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Card, CardContent } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { sourceFormSchema, type SourceFormValues } from '@/lib/zod-schemas'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, User } from 'lucide-react'
import { handleAddSource, handleEditSource } from '@/services/flow'
import { useReactFlow } from '@xyflow/react'

interface SoruceNodeDialogProps {
    id: string,
    isAdder: boolean;
    defaultValues?: SourceFormValues;
    data: SourceNodeData
}

interface SourceNodeData {
    isAdder?: boolean;
    label: string;
    description?: string;
    sourceType?: 'list' | string;
    listName?: string;
    subtitle?: string;
}

export default function SourceNodeForm({ isAdder, defaultValues, data, id }: SoruceNodeDialogProps) {

    const reactFlow = useReactFlow();
    const [step, setStep] = useState(1)
    const [open, setOpen] = useState(false)

    const form = useForm<SourceFormValues>({
        resolver: zodResolver(sourceFormSchema),
        defaultValues: defaultValues || {
            sourceType: "list",
            listName: "",
        },
    })

    const onSubmit = (values: SourceFormValues) => {
        if (isAdder) {
            handleAddSource(reactFlow, values)
        } else {
            handleEditSource(reactFlow, values, id)
        }
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {isAdder ? (
                    <div
                        className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer min-w-[180px] hover:bg-gray-50"
                    >
                        <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-gray-100">
                            <Plus className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium mb-1">{data.label}</p>
                        <p className="text-xs text-gray-500 text-center">{data.description}</p>
                    </div>
                ) : (
                    <div
                        className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm min-w-[180px] cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex items-start mb-2">
                            <div className="mr-3 bg-pink-100 p-2 rounded-lg">
                                <User className='w-6 h-6 text-pink-500' />
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    {data.label || "Leads from"}
                                </p>
                                <p className="text-pink-500 text-sm">
                                    {data.listName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isAdder ? "Add a Source Block" : "Edit Source"}</DialogTitle>
                    <DialogDescription>
                        {isAdder ? (
                            "Leads that match rules will be added to this sequence automatically."
                        ) : (
                            "Update the source settings for this node"
                        )}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <Card
                                    onClick={() => form.setValue("sourceType", "list")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        form.getValues("sourceType") === "list" ? "border-primary" : "border-muted"
                                    )}
                                >
                                    <CardContent className="flex items-center p-4">
                                        <div className="mr-4 bg-pink-100 p-2 rounded-lg">
                                            <User className='w-6 h-6 text-pink-500' />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Leads from List</p>
                                            <p className="text-muted-foreground text-xs">
                                                Import leads directly from a list you already have
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="opacity-50 cursor-not-allowed">
                                    <CardContent className="flex items-center p-4">
                                        <div className="mr-4 bg-gray-100 p-2 rounded-lg">
                                            <User className='w-6 h-6 text-pink-500' />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Leads from Signup (Disabled)</p>
                                            <p className="text-muted-foreground text-xs">
                                                Capture leads from your website signup form
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {step === 2 && (
                            <FormField
                                control={form.control}
                                name="listName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select List</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Select a list" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Sample List">Sample List</SelectItem>
                                                <SelectItem value="Campaign Leads">Campaign Leads</SelectItem>
                                                <SelectItem value="Newsletter Subscribers">Newsletter Subscribers</SelectItem>
                                                <SelectItem value="Recent Customers">Recent Customers</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </form>
                </Form>

                <DialogFooter>
                    {step === 1 ? (
                        <>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!form.watch("sourceType")}
                            >
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                                {isAdder ? "Insert" : "Save Changes"}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
