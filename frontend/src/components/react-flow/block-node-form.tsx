import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Clock, Mail, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import { formSchema, type FormSchemaType } from "@/lib/zod-schemas";
import { handleAdd, handleEdit } from "@/services/flow";
import { useReactFlow } from "@xyflow/react";

interface BlockNodeDialogProps {
    id: string,
    isAdder: boolean;
    defaultValues?: FormSchemaType;
}

export default function BlockNodeForm({ isAdder, defaultValues, id }: BlockNodeDialogProps) {

    const reactFlow = useReactFlow();

    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            blockType: "cold-email",
            emailTemplate: "",
            delayDuration: "",
            delayUnit: "minutes",
        },
    })

    const handleSubmit = (values: FormSchemaType) => {
        if (isAdder) {
            handleAdd(reactFlow, values)
        } else {
            handleEdit(reactFlow, values, id)
        }
        form.reset()
    }

    const handleBlockSelect = (type: "cold-email" | "wait-delay") => {
        form.setValue("blockType", type)
        setStep(2)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {
                    isAdder ? (
                        <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-gray-100 cursor-pointer">
                            <Plus className='w-6 h-6 text-blue-500' />
                        </div>
                    ) : (
                        <div
                            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm min-w-[180px] cursor-pointer hover:bg-gray-50"
                        >
                            <div className="flex items-start">
                                {form.formState.defaultValues?.blockType === "wait-delay" ? (
                                    <div className="mr-3 bg-yellow-100 p-2 rounded-lg">
                                        <Clock className="w-8 h-8 text-yellow-500" />
                                    </div>
                                ) : (
                                    <div className="mr-3 bg-blue-100 p-2 rounded-lg">
                                        <Mail className="w-8 h-8 text-blue-500" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-sm capitalize">
                                        {form.formState.defaultValues?.blockType}
                                    </p>
                                    <p className="text-blue-500 text-sm">
                                        {form.formState.defaultValues?.blockType === "wait-delay"
                                            ? `${form.formState.defaultValues?.delayDuration} 
                                               ${form.formState.defaultValues?.delayUnit}`
                                            : form.formState.defaultValues?.emailTemplate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </DialogTrigger>

            <DialogContent className="sm:max-w-[680px]">
                <DialogHeader>
                    <DialogTitle>Add Blocks</DialogTitle>
                    <DialogDescription>
                        Click on the block to configure and add it in the sequence
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Card
                                    onClick={() => handleBlockSelect("cold-email")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        form.watch("blockType") === "cold-email" ? "border-primary" : "border-muted"
                                    )}
                                >
                                    <CardContent className="flex items-center">
                                        <div className="mr-4 bg-blue-100 p-2 rounded-lg">
                                            <Mail className='w-8 h-8 text-blue-500' />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Cold Email</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    onClick={() => handleBlockSelect("wait-delay")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        form.watch("blockType") === "wait-delay" ? "border-primary" : "border-muted"
                                    )}
                                >
                                    <CardContent className="flex items-center">
                                        <div className="mr-4 bg-yellow-100 p-2 rounded-lg">
                                            <Clock className='w-8 h-8 text-yellow-500' />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Wait/Delay</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {step === 2 && form.watch("blockType") === "cold-email" && (
                            <FormField
                                control={form.control}
                                name="emailTemplate"
                                render={({ field }) => (
                                    <FormItem className="grid gap-4 py-4">
                                        <FormLabel>Select Template</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choose a template" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Sample template">Sample Template</SelectItem>
                                                <SelectItem value="Campaign template">Campaign 1 Template</SelectItem>
                                                <SelectItem value="Newsletter template">Newsletter Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {step === 2 && form.watch("blockType") === "wait-delay" && (
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="delayDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Delay Duration</FormLabel>
                                            <div className="grid grid-cols-2 gap-2">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        {...field}
                                                        placeholder="Enter delay"
                                                    />
                                                </FormControl>
                                                <FormField
                                                    control={form.control}
                                                    name="delayUnit"
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Unit" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="minutes">Minutes</SelectItem>
                                                                <SelectItem value="hours">Hours</SelectItem>
                                                                <SelectItem value="days">Days</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <DialogFooter>
                            {step === 1 ? (
                                <>
                                    <DialogClose asChild>
                                        <Button variant="outline" onClick={() => setOpen(false)} type="button">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        disabled={!form.watch("blockType")}
                                    >
                                        Next
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setStep(1)} type="button">
                                        Back
                                    </Button>
                                    <DialogClose asChild>
                                        <Button type="submit">
                                            {isAdder ? "Insert" : "Edit"}
                                        </Button>
                                    </DialogClose>
                                </>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
