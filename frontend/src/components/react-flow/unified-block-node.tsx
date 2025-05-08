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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Mail, Plus } from 'lucide-react';


interface BlockNodeData {
    isAdder?: boolean;
    label: string;
    description?: string;
    blockType?: 'list' | string;
    templateName?: string;
    subtitle?: string;
}

// Define props for the UnifiedSourceNode component
interface UnifiedBLockNodeProps {
    data: BlockNodeData;
    id: string;
}

/**
 * UnifiedBlockNode component that serves both as:
 * 1. A block adder node (isAdder=true)
 * 2. A regular block node (isAdder=false)
 */
export function UnifiedBlockNode({ data, id }: UnifiedBLockNodeProps) {

    const isAdder = data.isAdder || false;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState(data.blockType || null);
    const [selectedTemplate, setSelectedTemplate] = useState(data.templateName || "");
    const reactFlow = useReactFlow();

    // Handle adding a new block to the flow
    const handleBlockSelect = (blockType: string) => {
        setSelectedBlock(blockType);
        setStep(2);
    };

    // Handle inserting/saving the block
    const handleAction = () => {
        if (isAdder) {
            // Add new block logic
            if (selectedBlock === "cold-email" && selectedTemplate) {
                const VERTICAL_SPACING = 150;

                const existingNodes = reactFlow.getNodes();
                const startNode = existingNodes.find(node => node.id === '1');
                const blockNodes = existingNodes.filter(node =>
                    node.type === 'unifiedBlockNode' && !node.data.isAdder);
                const addBlockNode = existingNodes.find(node =>
                    node.type === 'unifiedBlockNode' && node.data.isAdder);

                const xPosition = startNode ? startNode.position.x : 300;

                let yPosition;
                if (blockNodes.length > 0) {
                    const lowestBlockY = blockNodes.reduce((max, node) =>
                        Math.max(max, node.position.y), startNode?.position.y || 0);
                    yPosition = lowestBlockY + VERTICAL_SPACING;
                } else {
                    yPosition = (startNode?.position.y || 0) + VERTICAL_SPACING;
                }

                const newBlockNode = {
                    id: Date.now().toString(),
                    type: 'unifiedBlockNode',
                    position: { x: xPosition, y: yPosition },
                    data: {
                        isAdder: false,
                        label: selectedBlock === "cold-email" ? "Cold Email" : selectedBlock,
                        blockType: selectedBlock,
                        templateName: selectedTemplate,
                    },
                };

                reactFlow.addNodes(newBlockNode);

                // Move add block node below the new block
                if (addBlockNode) {
                    reactFlow.setNodes(nodes =>
                        nodes.map(node => {
                            if (node.id === addBlockNode.id) {
                                return {
                                    ...node,
                                    position: {
                                        x: xPosition,
                                        y: yPosition + VERTICAL_SPACING,
                                    },
                                };
                            }
                            return node;
                        })
                    );
                }

                // Get all existing edges and remove any targeting the adder node
                const cleanedEdges = reactFlow.getEdges().filter(edge =>
                    edge.target !== addBlockNode?.id && edge.target !== newBlockNode.id
                );

                // Determine which block to connect from
                let previousBlockId = '1'; // default to start
                if (blockNodes.length > 0) {
                    const latestBlock = blockNodes.reduce((latest, node) =>
                        node.position.y > latest.position.y ? node : latest, blockNodes[0]);
                    previousBlockId = latestBlock.id;
                }

                // Add edge from previous block to the new one
                cleanedEdges.push({
                    id: `edge-${previousBlockId}-${newBlockNode.id}`,
                    source: previousBlockId,
                    target: newBlockNode.id,
                    type: 'default',
                });

                // Add edge from new block to adder node if it exists
                if (addBlockNode) {
                    cleanedEdges.push({
                        id: `edge-${newBlockNode.id}-${addBlockNode.id}`,
                        source: newBlockNode.id,
                        target: addBlockNode.id,
                        type: 'default',
                    });
                }

                // Update edges
                reactFlow.setEdges(cleanedEdges);
            }
        } else {
            // Update existing block logic
            reactFlow.setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...data,
                                templateName: selectedTemplate,
                                subtitle: selectedTemplate,
                                description: data.description || '(added by SalesBlink)'
                            }
                        };
                    }
                    return node;
                })
            );
        }

        // Reset and close dialog
        setStep(1);
        if (isAdder) {
            setSelectedBlock(null);
            setSelectedTemplate("");
        }
        setIsDialogOpen(false);
    };

    // Render the adder node UI
    if (isAdder) {
        return (
            <>
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-sm bg-gray-100"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <Plus className='w-6 h-6 text-blue-500' />
                </div>

                <Handle type="target" position={Position.Top} id="a" />
                <Handle type="source" position={Position.Bottom} id="b" />

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[680px]">
                        <DialogHeader>
                            <DialogTitle>Add Blocks</DialogTitle>
                            <DialogDescription>
                                Click on the block to configure and add it in the sequence
                            </DialogDescription>
                        </DialogHeader>

                        {step === 1 && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <Card
                                    onClick={() => handleBlockSelect("cold-email")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        selectedBlock === "cold-email" ? "border-primary" : "border-muted"
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

                                <Card className="opacity-50 cursor-not-allowed">
                                    <CardContent className="flex items-center">
                                        <div className="mr-4 bg-blue-100 p-2 rounded-lg">
                                            <Check className='w-8 h-8 text-blue-500' />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Tasks (Disabled)</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid gap-4 py-4 w-full">
                                <Label htmlFor="template">Select Template</Label>
                                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Choose a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sample template">Sample Template</SelectItem>
                                        <SelectItem value="Campaign template">Campaign 1 Template</SelectItem>
                                        <SelectItem value="Newsletter template">Newsletter Template</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    <Button disabled={!selectedTemplate} onClick={handleAction}>
                                        Insert
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    // Render the block node UI
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
                            {data.label || data.blockType}
                        </p>
                        <p className="text-blue-500 text-sm">
                            {data.templateName}
                        </p>
                        {data.description && (
                            <p className="text-gray-500 text-xs">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle type="target" position={Position.Top} id="b" />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Block</DialogTitle>
                        <DialogDescription>
                            Update the settings for this block
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Label htmlFor="templateSelect">Select template</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Sample template">Sample Template</SelectItem>
                                <SelectItem value="Campaign Leads">Campaign Leads</SelectItem>
                                <SelectItem value="Newsletter Subscribers">Newsletter Subscribers</SelectItem>
                                <SelectItem value="Recent Customers">Recent Customers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!selectedTemplate}
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