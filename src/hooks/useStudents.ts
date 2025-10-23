import React from 'react';
import { getAllStudents } from '@/services/training/studentsService';
import { Student } from '@/types/training/StudentTypes';

// Global cache
let studentsCache: Student[] | null = null;
let isLoading = false;
let listeners: Set<() => void> = new Set();

export const useStudents = (branchId?: number | null) => {
    const [allStudents, setAllStudents] = React.useState<Student[]>(
        studentsCache || []
    );
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const listener = () => {
            if (studentsCache) {
                setAllStudents(studentsCache);
                setLoading(false);
            }
        };

        listeners.add(listener);

        // Nếu chưa có cache và không đang loading
        if (!studentsCache && !isLoading) {
            isLoading = true;
            setLoading(true);

            console.log('📡 Fetching all students from API...');
            getAllStudents()
                .then((data: Student[]) => {
                    studentsCache = data || [];
                    isLoading = false;
                    console.log('✅ Cached', studentsCache.length, 'students');

                    // Notify all listeners
                    listeners.forEach(listener => listener());
                })
                .catch((error) => {
                    console.error('❌ Error fetching students:', error);
                    isLoading = false;
                    setLoading(false);
                });
        }

        return () => {
            listeners.delete(listener);
        };
    }, []);

    // Filter students theo branchId nếu có
    const filteredStudents = React.useMemo(() => {
        if (!branchId || !allStudents.length) {
            return allStudents;
        }

        const filtered = allStudents.filter(student =>
            student.academicInfo.idBranch === branchId
            && student.personalInfo.isActive
        );

        console.log('📦 Filtered', filtered.length, 'students for branch', branchId);
        return filtered;
    }, [allStudents, branchId]);

    return {
        students: filteredStudents,
        loading,
        totalStudents: allStudents.length
    };
};