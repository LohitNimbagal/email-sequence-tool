import { useRef, type JSX } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send, Mail } from 'lucide-react'
import { toast } from 'sonner'

// Define TypeScript interfaces
interface EmailData {
    to: string;
    subject: string;
    text: string;
    html: string;
}

interface EmailResponse {
    success: boolean;
    message: string;
}

// The mutation function for sending emails
const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    const response = await fetch('http://localhost:8080/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
    })

    if (!response.ok) {
        throw new Error('Failed to send email')
    }

    return response.json()
}

export default function EmailScheduler(): JSX.Element {
    const formRef = useRef<HTMLFormElement>(null);

    // Initialize the mutation
    const emailMutation = useMutation({
        mutationFn: sendEmail,
        onSuccess: (data) => {
            // Extract the scheduled time from the response message
            toast.success(data.message || "Email Scheduled", {
                description: "Your email has been successfully scheduled.",
                duration: 5000
            });

            // Reset form fields after successful submission
            if (formRef.current) {
                formRef.current.reset();
            }
        },
        onError: (error) => {
            // Show error toast
            console.error(error);
            toast.error("Failed to Schedule Email", {
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                duration: 5000
            });
        }
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const to = formData.get('to') as string;
        const subject = formData.get('subject') as string;
        const body = formData.get('body') as string;

        // Validate input fields
        if (!to || !subject || !body) {
            toast.warning("Missing Information", {
                description: "Please fill in all required fields"
            });
            return;
        }

        // Prepare email data
        const emailData: EmailData = {
            to,
            subject,
            text: body,
            html: `<p>${body}</p>`,
        }

        // Execute the mutation
        emailMutation.mutate(emailData)
    }

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <CardTitle>Quick Email Scheduler</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email-to" className="text-sm font-medium text-gray-700">
                            To
                        </Label>
                        <Input
                            id="email-to"
                            name="to"
                            type="email"
                            placeholder="Enter email address or select list"
                            className="border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email-subject" className="text-sm font-medium text-gray-700">
                            Subject
                        </Label>
                        <Input
                            id="email-subject"
                            name="subject"
                            placeholder="Enter email subject"
                            className="border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email-body" className="text-sm font-medium text-gray-700">
                            Email Body
                        </Label>
                        <Textarea
                            id="email-body"
                            name="body"
                            placeholder="Write your email content here..."
                            className="min-h-[200px] border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={emailMutation.isPending}
                        >
                            {emailMutation.isPending ? (
                                "Creating..."
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" /> Create Sequence
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}