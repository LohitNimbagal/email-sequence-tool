import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send } from 'lucide-react'

export default function EmailScheduler() {

    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSend = async () => {
        setLoading(true)
        setMessage('')

        const emailData = {
            to,
            subject,
            text: body,
            html: `<p>${body}</p>`,
        }

        try {
            const response = await fetch('http://localhost:8080/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            })

            setLoading(false)
            const result = await response.json()
            
            if (result.success) {
                setMessage('✅ Email scheduled successfully!')
            } else {
                setMessage('❌ Failed to schedule email.')
            }

        } catch (err) {
            console.error(err)
            setMessage('❌ An error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Quick Email Scheduler</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email-to">To</Label>
                        <Input id="email-to" placeholder="Enter email address or select list" value={to} onChange={e => setTo(e.target.value)} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input id="email-subject" placeholder="Enter email subject" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="email-body">Email Body</Label>
                        <Textarea id="email-body" placeholder="Write your email content here..." className="min-h-[200px]" value={body} onChange={e => setBody(e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button className="w-full md:w-auto" onClick={handleSend} disabled={loading}>
                            <Send className="mr-2 h-4 w-4" />
                            {loading ? 'Sending...' : 'Schedule Email'}
                        </Button>
                    </div>

                    {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
                </div>
            </CardContent>
        </Card>
    )
}
