import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Students.css';

// Mock Data
const mockStudents = [
    { id: '101', name: 'Aarav Sharma', class: 'Class X', section: 'A', primaryGuardian: 'Rajesh Sharma', status: 'Enrolled' },
    { id: '102', name: 'Diya Desai', class: 'Class XI', section: 'B (Commerce)', primaryGuardian: 'Anita Desai', status: 'Enrolled' },
];

export const Students = () => {
    const studentColumns = [
        { header: 'Admission ID', accessorKey: 'id' },
        { header: 'Student Name', accessorKey: 'name' },
        { header: 'Class', accessorKey: 'class' },
        { header: 'Section', accessorKey: 'section' },
        {
            header: 'Primary Guardian',
            accessorKey: 'primaryGuardian',
            cell: (item: any) => (
                <span className="guardian-link text-primary cursor-pointer hover:underline">
                    {item.primaryGuardian}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`student-status ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Profile',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Open</Button>
        },
    ];

    return (
        <div className="students-page animate-fade-in">
            <PageHeader
                title="Student Directory & SIS"
                description="View and manage enrolled students and their guardian mappings."
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary">Import Bulk Data</Button>
                        <Button>+ New Admission</Button>
                    </div>
                }
            />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Active Students Directory</CardTitle>
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="student-search-input"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table data={mockStudents} columns={studentColumns} />
                </CardContent>
            </Card>
        </div>
    );
};
