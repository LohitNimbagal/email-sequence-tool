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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Mail, Plus } from 'lucide-react';

export function AddBlockNode() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState<"cold-email" | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const reactFlow: ReactFlowInstance = useReactFlow();

    const handleBlockSelect = (block: "cold-email") => {
        setSelectedBlock(block);
        setStep(2);
    };

    const handleAddSource = () => {
        if (selectedBlock === "cold-email" && selectedTemplate) {
            const VERTICAL_SPACING = 150;

            const existingNodes = reactFlow.getNodes();
            const startNode = existingNodes.find(node => node.id === '1');
            const blockNodes = existingNodes.filter(node => node.type === 'blockNode');
            const addBlockNode = existingNodes.find(node => node.id === 'add-block');

            const xPosition = startNode ? startNode.position.x : 300;

            let yPosition;
            if (blockNodes.length > 0) {
                const lowestBlockY = blockNodes.reduce((max, node) =>
                    Math.max(max, node.position.y), startNode?.position.y || 0);
                yPosition = lowestBlockY + VERTICAL_SPACING;
            } else {
                yPosition = (startNode?.position.y || 0) + VERTICAL_SPACING;
            }

            const newblockNode = {
                id: Date.now().toString(),
                type: 'blockNode',
                position: { x: xPosition, y: yPosition },
                data: {
                    label: selectedBlock,
                    sourceType: 'cold-email',
                    templateName: selectedTemplate,
                },
            };

            reactFlow.addNodes(newblockNode);

            // Move add block node below the new block
            if (addBlockNode) {
                reactFlow.setNodes(nodes =>
                    nodes.map(node => {
                        if (node.id === 'add-block') {
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

            // Get all existing edges and remove any targeting 'add-block'
            const cleanedEdges = reactFlow.getEdges().filter(edge =>
                edge.target !== 'add-block' && edge.target !== newblockNode.id
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
                id: `edge-${previousBlockId}-${newblockNode.id}`,
                source: previousBlockId,
                target: newblockNode.id,
                type: 'default',
            });

            // Add edge from new block to 'add-block' if it exists
            if (addBlockNode) {
                cleanedEdges.push({
                    id: `edge-${newblockNode.id}-add-block`,
                    source: newblockNode.id,
                    target: addBlockNode.id,
                    type: 'default',
                });
            }

            // Update edges
            reactFlow.setEdges(cleanedEdges);

            setStep(1);
            setSelectedBlock(null);
            setSelectedTemplate("");
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <div
                className="flex items-center justify-center w-10 h-10 rounded-sm bg-gray-100"
                onClick={() => setIsDialogOpen(true)}
            >
                <Plus className='w-6 h-6 text-blue-500' />
            </div>

            <Handle type="target" position={Position.Top} id="a" />
            <Handle type="target" position={Position.Bottom} id="b" />

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
                                <Button disabled={!selectedTemplate} onClick={handleAddSource}>
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
