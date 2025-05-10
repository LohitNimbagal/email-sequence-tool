import { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow, type Node as FlowNode } from '@xyflow/react';
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
import { Clock, Mail, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Input } from '../ui/input';

interface BlockNodeData extends Record<string, unknown> {
    isAdder?: boolean;
    label: string;
    description?: string;
    blockType?: 'cold-email' | 'wait-delay' | string;
    templateName?: string;
    subtitle?: string;
    duration?: string;
    durationUnit?: string;
}

interface NewTypeData extends BlockNodeData {
    isAdder: boolean;
    blockType: string;
    label: string;
}

// Define props for the SourceNode component
interface UnifiedBLockNodeProps {
    data: BlockNodeData;
    id: string;
}

export function BlockNode({ data, id }: UnifiedBLockNodeProps) {

    const isAdder = data.isAdder || false;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState(data.blockType || null);
    const [selectedTemplate, setSelectedTemplate] = useState(data.templateName || "");
    const reactFlow = useReactFlow();

    // Initialize from existing data if available
    const [delayDuration, setDelayDuration] = useState<string>(data.duration || "");
    const [delayUnit, setDelayUnit] = useState<string>(data.durationUnit || "minutes");

    // Update local state when data changes
    useEffect(() => {
        if (data.templateName) {
            setSelectedTemplate(data.templateName);
        }
        if (data.duration) {
            setDelayDuration(data.duration);
        }
        if (data.durationUnit) {
            setDelayUnit(data.durationUnit);
        }
    }, [data]);

    // Handle adding a new block to the flow
    const handleBlockSelect = (blockType: string) => {
        setSelectedBlock(blockType);
        setStep(2);
    };

    // Handle inserting/saving the block
    const handleAction = () => {

        if (isAdder) {
            const VERTICAL_SPACING = 150;

            const existingNodes = reactFlow.getNodes();
            const startNode = existingNodes.find(node => node.id === 'node-sequence-starting-point');
            const blockNodes = existingNodes.filter(node =>
                node.type === 'blockNode' && !node.data.isAdder);
            const addBlockNode = existingNodes.find(node =>
                node.type === 'blockNode' && node.data.isAdder);

            const xPosition = startNode ? startNode.position.x : 300;

            let yPosition;
            if (blockNodes.length > 0) {
                const lowestBlockY = blockNodes.reduce((max, node) =>
                    Math.max(max, node.position.y), startNode?.position.y || 0);
                yPosition = lowestBlockY + VERTICAL_SPACING;
            } else {
                yPosition = (startNode?.position.y || 0) + VERTICAL_SPACING;
            }

            const newBlockId = `node-${nanoid()}`;

            // Block-specific data
            const blockData: NewTypeData = {
                isAdder: false,
                blockType: selectedBlock!,
                label: selectedBlock === "cold-email" ? "Cold Email" : "Wait / Delay",
            };

            if (selectedBlock === "cold-email") {
                if (!selectedTemplate) return;
                blockData.templateName = selectedTemplate;
            } else if (selectedBlock === "wait-delay") {
                if (!delayDuration || !delayUnit) return;
                blockData.duration = delayDuration;
                blockData.durationUnit = delayUnit;
            }

            const newBlockNode: FlowNode = {
                id: newBlockId,
                type: 'blockNode',
                position: { x: xPosition, y: yPosition },
                data: blockData,
            };

            reactFlow.addNodes(newBlockNode);

            // Move adder node below new block
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

            // Clean edges
            const cleanedEdges = reactFlow.getEdges().filter(edge =>
                edge.target !== addBlockNode?.id && edge.target !== newBlockId
            );

            // Determine connection source
            let previousBlockId = 'node-sequence-starting-point';
            if (blockNodes.length > 0) {
                const latestBlock = blockNodes.reduce((latest, node) =>
                    node.position.y > latest.position.y ? node : latest, blockNodes[0]);
                previousBlockId = latestBlock.id;
            }

            // Add new edges
            cleanedEdges.push({
                id: `edge-${nanoid()}`,
                source: previousBlockId,
                target: newBlockId,
                type: 'default',
            });

            if (addBlockNode) {
                cleanedEdges.push({
                    id: `edge-${nanoid()}`,
                    source: newBlockId,
                    target: addBlockNode.id,
                    type: 'default',
                });
            }

            reactFlow.setEdges(cleanedEdges);
        } else {
            // Update existing block logic with correct block-specific data
            if (data.blockType === "cold-email") {
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
            } else if (data.blockType === "wait-delay") {
                reactFlow.setNodes((nodes) =>
                    nodes.map((node) => {
                        if (node.id === id) {
                            return {
                                ...node,
                                data: {
                                    ...data,
                                    duration: delayDuration,
                                    durationUnit: delayUnit,
                                    description: data.description || '(added by SalesBlink)'
                                }
                            };
                        }
                        return node;
                    })
                );
            }
        }

        // Reset and close
        setStep(1);
        if (isAdder) {
            setSelectedBlock(null);
            setSelectedTemplate("");
            setDelayDuration("");
            setDelayUnit("minutes");
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
                                {/* Cold Email Block */}
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

                                {/* Wait/Delay Block */}
                                <Card
                                    onClick={() => handleBlockSelect("wait-delay")}
                                    className={cn(
                                        "cursor-pointer border-2 transition-all",
                                        selectedBlock === "wait-delay" ? "border-primary" : "border-muted"
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


                        {step === 2 && selectedBlock === "cold-email" && (
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

                        {step === 2 && selectedBlock === "wait-delay" && (
                            <div className="grid gap-4 py-4 w-full">
                                <Label htmlFor="duration">Delay Duration</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="duration"
                                        type="number"
                                        min={1}
                                        value={delayDuration}
                                        onChange={(e) => setDelayDuration(e.target.value)}
                                        className="w-full"
                                        placeholder="Enter delay"
                                    />
                                    <Select
                                        value={delayUnit}
                                        onValueChange={(value) => setDelayUnit(value)}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minutes">Minutes</SelectItem>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                    <Button disabled={
                                        (selectedBlock === "cold-email" && !selectedTemplate) ||
                                        (selectedBlock === "wait-delay" && (!delayDuration || !delayUnit))
                                    }
                                        onClick={handleAction}>
                                        Insert
                                    </Button>
                                </>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog >
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
                    {data.blockType === "wait-delay" ? (
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
                            {data.label || data.blockType}
                        </p>
                        <p className="text-blue-500 text-sm">
                            {data.blockType === "wait-delay"
                                ? `${data.duration || ''} ${data.durationUnit || 'minutes'}`
                                : data.templateName}
                        </p>
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
                        {data.blockType === "cold-email" && (
                            <>
                                <Label htmlFor="templateSelect">Select template</Label>
                                <Select
                                    value={selectedTemplate}
                                    onValueChange={setSelectedTemplate}
                                >
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
                            </>
                        )}

                        {data.blockType === "wait-delay" && (
                            <>
                                <div>
                                    <Label>Delay Duration</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={delayDuration}
                                        onChange={(e) => setDelayDuration(e.target.value)}
                                        className="w-full mt-1"
                                        placeholder="Enter number"
                                    />
                                </div>

                                <div>
                                    <Label>Delay Unit</Label>
                                    <Select
                                        value={delayUnit}
                                        onValueChange={(value) => setDelayUnit(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="minutes">Minutes</SelectItem>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                (data.blockType === "cold-email" && !selectedTemplate) ||
                                (data.blockType === "wait-delay" && !delayDuration)
                            }
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