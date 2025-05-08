import { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from 'lucide-react';

interface SourceNodeData {
    isAdder?: boolean;
    label: string;
    description?: string;
    sourceType?: 'list' | string;
    listName?: string;
    subtitle?: string;
}

// Define props for the UnifiedSourceNode component
interface UnifiedSourceNodeProps {
    data: SourceNodeData;
    id: string;
}

/**
 * UnifiedSourceNode component that serves both as:
 * 1. A source adder node (isAdder=true)
 * 2. A regular source node (isAdder=false)
 */
export function UnifiedSourceNode({ data, id }: UnifiedSourceNodeProps) {
    const isAdder = data.isAdder || false;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedSource, setSelectedSource] = useState(data.sourceType || null);
    const [selectedList, setSelectedList] = useState(data.listName || "");
    const reactFlow = useReactFlow();

    const existingNodes = reactFlow.getNodes();
    const addBlockNode = existingNodes.find(node => node.id === 'add-block');

    const openDialog = () => {
        setIsDialogOpen(true);
        if (isAdder) {
            setStep(1);
            setSelectedSource(null);
            setSelectedList("");
        }
    };

    const handleSourceSelect = (sourceType: string) => {
        setSelectedSource(sourceType);
        setStep(2);
    };

    const handleAction = () => {
        if (isAdder) {
            // Add new source logic
            if (selectedSource === "list" && selectedList) {
                const HORIZONTAL_SPACING = 250;
                const START_Y = 300;
                const existingNodes = reactFlow.getNodes();
                const sourceNodes = existingNodes.filter(node =>
                    node.type === 'unifiedSourceNode' && !node.data.isAdder);

                // Calculate X position for the new node
                let xPosition;

                if (sourceNodes.length > 0) {
                    // Find the rightmost existing source node
                    const rightmostNodeX = sourceNodes.reduce(
                        (max, node) => Math.max(max, node.position.x),
                        -Infinity
                    );
                    xPosition = rightmostNodeX + HORIZONTAL_SPACING;
                } else {
                    // First source node — place to the right of node '1'
                    const startNode = existingNodes.find(node => node.id === '1');
                    xPosition = startNode ? startNode.position.x + HORIZONTAL_SPACING : 300;
                }

                const newNode = {
                    id: Date.now().toString(),
                    type: 'unifiedSourceNode',
                    position: { x: xPosition, y: START_Y },
                    data: {
                        isAdder: false,
                        label: "Leads from",
                        sourceType: selectedSource,
                        listName: selectedList,
                        subtitle: selectedList,
                    },
                };

                // Create a new edge to connect the new source node to the sequence start point (id: '1')
                const newEdge = {
                    id: `edge-${Date.now()}`,
                    source: newNode.id,
                    target: '1', // Connect to the sequence start point
                    type: 'default',
                };

                reactFlow.addNodes(newNode);
                reactFlow.addEdges(newEdge);

                if (addBlockNode) {
                    reactFlow.addEdges({
                        id: `default-edge-to-add`,
                        source: '1',
                        target: addBlockNode.id,
                        type: 'default',
                    });
                }
            }
        } else {
            // Update existing source logic
            reactFlow.setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...data,
                                listName: selectedList,
                                subtitle: selectedList,
                                description: data.description || '(added by SalesBlink)'
                            }
                        };
                    }
                    return node;
                })
            );
        }

        // Reset and close dialog
        setIsDialogOpen(false);
        if (isAdder) {
            setStep(1);
            setSelectedSource(null);
            setSelectedList("");
        }
    };

    // Render the "add source" node UI
    if (isAdder) {
        return (
            <>
                <div
                    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer min-w-[180px] hover:bg-gray-50"
                    onClick={openDialog}
                >
                    <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-full bg-gray-100">
                        <Plus className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium mb-1">{data.label}</p>
                    <p className="text-xs text-gray-500 text-center">{data.description}</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>Add a Source Block</DialogTitle>
                            <DialogDescription>
                                Leads that match rules will be added to this sequence automatically.
                            </DialogDescription>
                        </DialogHeader>

                        {step === 1 && (
                            <div className="grid gap-4 py-4">
                                <Card
                                    onClick={() => handleSourceSelect("list")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        selectedSource === "list" ? "border-primary" : "border-muted"
                                    )}
                                >
                                    <CardContent className="flex items-center p-4">
                                        <div className="mr-4 bg-pink-100 p-2 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-pink-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b9d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                                <line x1="9" y1="21" x2="9" y2="9"></line>
                                            </svg>
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
                        )}

                        <DialogFooter>
                            {step === 1 ? (
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button onClick={handleAction} disabled={!selectedList}>
                                        Insert
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Handle type="source" position={Position.Bottom} id="a" />
            </>
        );
    }

    // Render the source node UI
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
                            {data.subtitle || data.listName}
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
                            onClick={handleAction}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}