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
    router.get('/sequences', isAuthenticated, getAllSequences);
    router.get('/sequences/:id', isAuthenticated, getSequenceByIdController);
    router.post('/sequences', isAuthenticated, createSequenceController);
    router.patch('/sequences/:id', isAuthenticated, updateSequenceController);
    router.delete('/sequences/:id', isAuthenticated, deleteSequenceController);
};
