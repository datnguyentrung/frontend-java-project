import React from 'react';
import { getAllBranches } from '@/services/training/branchesService';
import { Branch } from '@/types/types';

// Global cache
let branchesCache: { value: number; label: string; }[] | null = null;
let isLoading = false;
let listeners: Set<() => void> = new Set();

export const useBranches = () => {
    const [branches, setBranches] = React.useState<{ value: number; label: string; }[]>(
        branchesCache || []
    );
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const listener = () => {
            if (branchesCache) {
                setBranches(branchesCache);
                setLoading(false);
            }
        };

        listeners.add(listener);

        // Nếu chưa có cache và không đang loading
        if (!branchesCache && !isLoading) {
            isLoading = true;
            setLoading(true);

            getAllBranches()
                .then((data: Branch[]) => {
                    const simplified = data.map(b => ({
                        value: b.idBranch,
                        label: b.title,
                    }));

                    branchesCache = simplified;
                    isLoading = false;

                    // Notify all listeners
                    listeners.forEach(listener => listener());
                })
                .catch((error) => {
                    console.error('Error fetching branches:', error);
                    isLoading = false;
                    setLoading(false);
                });
        }

        return () => {
            listeners.delete(listener);
        };
    }, []);

    return { branches, loading };
};