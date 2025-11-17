import { ClassSession, ClassSessionDetails } from '@/types/training/ClassSessionTypes';
import { getAllClassSessions } from '@/services/training/classSessionsService';
import React from 'react';
import { weekDays } from '@/styles/weekDays';

// Global cache
let classSessionsCache: ClassSessionDetails[] | null = null;
let isLoading = false;
let listeners: Set<() => void> = new Set();

export const useClassSessions = () => {
    const [classSessions, setClassSessions] = React.useState<ClassSessionDetails[]>(
        classSessionsCache || []
    );
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const listener = () => {
            if (classSessionsCache) {
                setClassSessions(classSessionsCache);
                setLoading(false);
            }
        };

        listeners.add(listener);

        // Nếu chưa có cache và không đang loading
        if (!classSessionsCache && !isLoading) {
            isLoading = true;
            setLoading(true);

            getAllClassSessions()
                .then((data: ClassSession[]) => {
                    const simplified = data.map(cs => ({
                        value: cs.idClassSession,
                        label: "Thứ " + weekDays.find(wd => wd.context === cs.weekday)?.key + " - Ca " + cs.idClassSession.substring(4, 5),
                        classLevel: cs.classLevel,
                        location: cs.location,
                        shift: cs.shift,
                        weekday: cs.weekday,
                        session: cs.session,
                        isActive: cs.isActive,
                        idBranch: cs.idBranch
                    }));

                    classSessionsCache = simplified;
                    isLoading = false;

                    // Notify all listeners
                    listeners.forEach(listener => listener());
                })
                .catch((error) => {
                    console.error('Error fetching class sessions:', error);
                    isLoading = false;
                    setLoading(false);
                });
        }

        return () => {
            listeners.delete(listener);
        };
    }, []);

    return { classSessions, loading };
};