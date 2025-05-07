import { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SourceNodeData {
    label: string;
    listName?: string;
    subtitle?: string;
    description?: string;
}

interface SourceNodeProps {
    data: SourceNodeData;
    id: string;
}

export function SourceNode({ data, id }: SourceNodeProps) {
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(data.listName || "");
    const reactFlow = useReactFlow();

    const handleUpdate = () => {
        // Update the node data
        const updatedNode = {
            id: id,
            data: {
                ...data,
                label: `Leads from`,
                listName: selectedList,
                subtitle: selectedList,
                description: '(added by SalesBlink)'
            },
        };

        // Use setNodes to update the node
        reactFlow.setNodes((nodes) =>
            nodes.map((node) => (node.id === id ? { ...node, data: updatedNode.data } : node))
        );

        // Close the dialog
        setIsDialogOpen(false);
    };

    return (
        <>
            <div
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm min-w-[180px] cursor-pointer hover:bg-gray-50"
                onClick={() => setIsDialogOpen(true)}
            >
                <div className="flex items-start mb-2">
                    <div className="mr-3 bg-pink-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-sm">
                            {data.label}
                        </p>
                        <p className="text-pink-500 text-sm">
                            {data.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle type="target" position={Position.Top} />

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Source</DialogTitle>
                        <DialogDescription>
                            Update the source settings for this node
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Label htmlFor="listSelect">Select List</Label>
                        <select
                            id="listSelect"
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            className="border border-input rounded-md p-2"
                        >
                            <option value="">-- Choose a List --</option>
                            <option value="Sample List">Sample List</option>
                            <option value="Campaign Leads">Campaign Leads</option>
                            <option value="Newsletter Subscribers">Newsletter Subscribers</option>
                            <option value="Recent Customers">Recent Customers</option>
                        </select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!selectedList}
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}