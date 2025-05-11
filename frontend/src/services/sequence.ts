import { queryOptions } from "@tanstack/react-query";
import type { Edge, Node } from "@xyflow/react";

export interface Sequence {
    _id: string;
    name: string;
    status?: string;
    scheduleTime?: string;
    nodes: Node[]
    edges: Edge[]
}

export const fetchSequences = async (): Promise<Sequence[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/sequences', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sequences');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching sequences:', error);
        return []; // Return empty array on error
    }
};

export const fetchSequence = async (sequenceId: string): Promise<Sequence> => {
    try {
        const response = await fetch(`http://localhost:8080/api/sequences/${sequenceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sequence');
        }

        return await response.json(); // Now correctly returning a single object
    } catch (error) {
        console.error('Error fetching sequence:', error);
        throw error; // Let React Query handle the error
    }
};

export const createSequence = async (name: string): Promise<Sequence> => {
    const response = await fetch('http://localhost:8080/api/sequences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error('Failed to create sequence');
    }

    return await response.json();
};

export const sequencesQueryOptions = queryOptions({
    queryKey: ['sequences'],
    queryFn: () => fetchSequences(),
})

export const sequenceQueryOptions = (sequenceId: string) => queryOptions({
    queryKey: ['sequences', { sequenceId }],
    queryFn: () => fetchSequence(sequenceId),
})

export const saveSquence = async ({ nodes, edges, sequenceId, name }: { nodes: Node[], edges: Edge[], sequenceId: string, name: string }) => {
    const response = await fetch(`http://localhost:8080/api/sequences/${sequenceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nodes, edges, name }),
    });
    if (!response.ok) throw new Error('Failed to update sequence');
    return response.json();
}