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
import { Mail } from 'lucide-react';

interface BlockNodeData {
    label: string;
    templateName?: string;
    subtitle?: string;
    description?: string;
}

interface BlockNodeProps {
    data: BlockNodeData;
    id: string;
}

export function BlockNode({ data, id }: BlockNodeProps) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(data.templateName || "");
    const reactFlow = useReactFlow();

    const handleUpdate = () => {
        // Update the node data
        const updatedNode = {
            id: id,
            data: {
                ...data,
                label: `Leads from`,
                templateName: selectedTemplate,
                subtitle: selectedTemplate,
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
                <div className="flex items-start">
                    <div className="mr-3 bg-blue-100 p-2 rounded-lg">
                        <Mail className='w-8 h-8 text-blue-500' />
                    </div>
                    <div>
                        <p className="font-medium text-sm capitalize">
                            {data.label}
                        </p>
                        <p className="text-blue-500 text-sm">
                            {data.templateName}
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
                        <Label htmlFor="templateSelect">Select template</Label>
                        <select
                            id="templateSelect"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="border border-input rounded-md p-2"
                        >
                            <option value="">-- Choose a template --</option>
                            <option value="Sample template">Sample template</option>
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
                            disabled={!selectedTemplate}
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