import { useState } from "react";
import Table from "../../components/ui/table";
import Dialog from "../../components/ui/dialog";
import Button from "../../components/ui/button";

const columns = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    { key: "scheduleTime", label: "Schedule Time" },
    { key: "action", label: "Actions" },
];

const rows = [
    {
        name: "Test",
        status: "Paused",
        scheduleTime: "Paused",
        action: <a href="#" className="text-blue-600 hover:underline">Edit</a>,
    },
    {
        name: "Lohit's First Sequence 🚀",
        status: "Paused",
        scheduleTime: "Paused",
        action: <a href="#" className="text-blue-600 hover:underline">Edit</a>,
    },
];

export default function Sequence() {
    
    const [open, setOpen] = useState(false)
    const [sequenceName, setSequenceName] = useState("")

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Outreach Sequences</h1>
                    <p className="text-gray-600">Create/Manage your sequences with automated emails & timely tasks.</p>
                </div>
                <Button onClick={() => setOpen(true)}>
                    <span>Create New Sequence</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </Button>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} title="Create New Sequence">
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    // Handle form submission here
                    setOpen(false);
                }}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Sequence Name</label>
                        <input
                            type="text"
                            value={sequenceName}
                            onChange={(e) => setSequenceName(e.target.value)}
                            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter sequence name"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </Dialog>

            <Table columns={columns} rows={rows} />
        </div>
    )
}
