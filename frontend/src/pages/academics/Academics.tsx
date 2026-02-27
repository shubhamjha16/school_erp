import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Academics.css';

// Mock Data
const mockYears = [
    { id: '1', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Active' },
    { id: '2', name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', status: 'Completed' },
];

const mockClasses = [
    { id: '1', name: 'Class X', sections: 'A, B, C', stream: 'General' },
    { id: '2', name: 'Class XI', sections: 'A (Science), B (Commerce)', stream: 'Mixed' },
];

export const Academics = () => {
    const [activeTab, setActiveTab] = useState<'years' | 'classes'>('years');

    const yearColumns = [
        { header: 'Academic Year', accessorKey: 'name' },
        { header: 'Start Date', accessorKey: 'startDate' },
        { header: 'End Date', accessorKey: 'endDate' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`academic-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Manage</Button>
        },
    ];

    const classColumns = [
        { header: 'Class Name', accessorKey: 'name' },
        { header: 'Sections', accessorKey: 'sections' },
        { header: 'Stream/Group', accessorKey: 'stream' },
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
                <button
                    className={`tab-btn ${activeTab === 'years' ? 'active' : ''}`}
                    onClick={() => setActiveTab('years')}
                >
                    Academic Years
                </button>
                <button
                    className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classes')}
                >
                    Classes & Sections
                </button>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>
                        {activeTab === 'years' ? 'Academic Sessions' : 'Class Configurations'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeTab === 'years' ? (
                        <Table data={mockYears} columns={yearColumns} />
                    ) : (
                        <Table data={mockClasses} columns={classColumns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
