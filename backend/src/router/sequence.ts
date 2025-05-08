import express from 'express';
import {
    getAllSequences,
    getSequenceByIdController,
    createSequenceController,
    updateSequenceController,
    deleteSequenceController
} from '../controllers/sequence';

import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    // Get all sequences
    router.get('/sequences', isAuthenticated, getAllSequences);

    // Get a sequence by ID
    router.get('/sequences/:id', isAuthenticated, getSequenceByIdController);

    // Create a new sequence
    router.post('/sequences', isAuthenticated, createSequenceController);

    // Update an existing sequence by ID
    router.patch('/sequences/:id', isAuthenticated, updateSequenceController);

    // Delete a sequence by ID
    router.delete('/sequences/:id', isAuthenticated, deleteSequenceController);
};
