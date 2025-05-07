import { useState } from 'react';
import { Handle, Position, useReactFlow, type ReactFlowInstance } from '@xyflow/react';
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

interface AddSourceNodeData {
    label: string;
    description: string;
}

interface AddSourceNodeProps {
    data: AddSourceNodeData;
}

export function AddSourceNode({ data }: AddSourceNodeProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedSource, setSelectedSource] = useState<"list" | null>(null);
    const [selectedList, setSelectedList] = useState("");
    const reactFlow: ReactFlowInstance = useReactFlow();

    const existingNodes = reactFlow.getNodes();
    const addBlockNode = existingNodes.find(node => node.id === 'add-block');

    const openDialog = () => {
        setIsDialogOpen(true);
        setStep(1);
        setSelectedSource(null);
        setSelectedList("");
    };

    const handleSourceSelect = (source: "list") => {
        setSelectedSource(source);
        setStep(2);
    };

    const handleAddSource = () => {
        if (selectedSource === "list" && selectedList) {
            const HORIZONTAL_SPACING = 250;
            const START_Y = 300;
            const existingNodes = reactFlow.getNodes();
            const sourceNodes = existingNodes.filter(node => node.type === 'sourceNode');

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
                type: 'sourceNode',
                position: { x: xPosition, y: START_Y },
                data: {
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

            // const newEdges = [...reactFlow.getEdges()];

            if (addBlockNode) {
                reactFlow.addEdges({
                    id: `default-edge-to-add`,
                    source: '1',
                    target: addBlockNode.id,
                    type: 'default',
                });
            }

            setIsDialogOpen(false);
        }
    };


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
                                <Button onClick={handleAddSource} disabled={!selectedList}>
                                    Insert
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Only render handle on the actual node */}
            <Handle type="source" position={Position.Bottom} id="a" />
        </>
    );
}
