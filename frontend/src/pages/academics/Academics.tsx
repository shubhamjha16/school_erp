import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { SchoolClassOut } from '../../types';
import './Academics.css';

// Fallback mock data
const mockYears = [
    { id: 1, school_id: 1, name: '2025-2026' },
    { id: 2, school_id: 1, name: '2024-2025' },
];
const mockClasses = [
    { id: 1, school_id: 1, name: 'Class X' },
    { id: 2, school_id: 1, name: 'Class XI' },
];

export const Academics = () => {
    const [activeTab, setActiveTab] = useState<'years' | 'classes'>('years');
    const [years, setYears] = useState<any[]>([]);
    const [classes, setClasses] = useState<SchoolClassOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const cls = await fetchApi<SchoolClassOut[]>('/academic/classes');
                setClasses(cls);
                setYears(mockYears); // No list endpoint for years yet
            } catch {
                setYears(mockYears);
                setClasses(mockClasses);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const yearColumns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Academic Year', accessorKey: 'name' },
        { header: 'School ID', accessorKey: 'school_id' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Manage</Button>
        },
    ];

    const classColumns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Class Name', accessorKey: 'name' },
        { header: 'School ID', accessorKey: 'school_id' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Manage</Button>
        },
    ];

    return (
        <div className="academics-page animate-fade-in">
            <PageHeader
                title="Academic Setup"
                description="Configure academic years, classes, sections, and subjects."
                actions={
                    <Button>
                        {activeTab === 'years' ? '+ Term / Year' : '+ New Class'}
                    </Button>
                }
            />

            <div className="tabs">
                <button className={`tab-btn ${activeTab === 'years' ? 'active' : ''}`} onClick={() => setActiveTab('years')}>
                    Academic Years ({years.length})
                </button>
                <button className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`} onClick={() => setActiveTab('classes')}>
                    Classes ({classes.length})
                </button>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>{activeTab === 'years' ? 'Academic Sessions' : 'Class Configurations'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : activeTab === 'years' ? (
                        <Table data={years} columns={yearColumns} />
                    ) : (
                        <Table data={classes} columns={classColumns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
