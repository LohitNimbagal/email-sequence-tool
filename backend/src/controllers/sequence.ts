import { Request, Response } from 'express';
import {
    getSequences,
    getSequenceById,
    createSequence,
    deleteSequenceById,
    updateSequenceById
} from '../db/sequence';

// Get all sequences for the logged-in user
export const getAllSequences = async (req: Request, res: Response) => {
    const userId = (req as any).identity?._id;

    try {
        const sequences = await getSequences(userId);
        res.status(200).json(sequences);
    } catch (error) {
        console.error('Error fetching sequences:', error);
        res.status(500).json({ message: 'Server error while fetching sequences' });
    }
};

// Get a sequence by ID if it belongs to the user
export const getSequenceByIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).identity?._id;

    try {
        const sequence = await getSequenceById(id, userId);
        if (!sequence) {
            res.status(404).json({ message: 'Sequence not found' });
            return;
        }
        res.status(200).json(sequence);
    } catch (error) {
        console.error('Error fetching sequence by ID:', error);
        res.status(500).json({ message: 'Server error while fetching the sequence' });
    }
};

// Create a new sequence for the user
export const createSequenceController = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).identity?._id;
    const { name, nodes = [], edges = [] } = req.body;

    if (!name) {
        res.status(400).json({ message: 'Name is required' });
        return;
    }

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        res.status(400).json({ message: 'Nodes and edges must be arrays' });
        return;
    }

    try {
        const newSequence = await createSequence({
            name,
            nodes,
            edges,
            userId
        });

        res.status(201).json(newSequence);
    } catch (error) {
        console.error('Error creating sequence:', error);
        res.status(500).json({ message: 'Server error while creating the sequence' });
    }
};

// Update an existing sequence
export const updateSequenceController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).identity?._id;
    const { name, nodes, edges } = req.body;

    if (!name) {
        res.status(400).json({ message: 'Name is required' });
        return;
    }

    if (nodes && !Array.isArray(nodes)) {
        res.status(400).json({ message: 'Nodes must be an array' });
        return;
    }

    if (edges && !Array.isArray(edges)) {
        res.status(400).json({ message: 'Edges must be an array' });
        return;
    }

    try {
        const updatedSequence = await updateSequenceById(id, userId, {
            name,
            nodes,
            edges,
            updatedAt: new Date()
        });

        if (!updatedSequence) {
            res.status(404).json({ message: 'Sequence not found or not authorized' });
            return;
        }

        res.status(200).json(updatedSequence);
    } catch (error) {
        console.error('Error updating sequence:', error);
        res.status(500).json({ message: 'Server error while updating the sequence' });
    }
};

// Delete a sequence
export const deleteSequenceController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).identity?._id;

    try {
        const deletedSequence = await deleteSequenceById(id, userId);

        if (!deletedSequence) {
            res.status(404).json({ message: 'Sequence not found or not authorized' });
            return;
        }

        res.status(200).json({ message: 'Sequence deleted successfully' });
    } catch (error) {
        console.error('Error deleting sequence:', error);
        res.status(500).json({ message: 'Server error while deleting the sequence' });
    }
};
