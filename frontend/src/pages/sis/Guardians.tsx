import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Guardians.css';

// Mock Data
const mockGuardians = [
    { id: '1', name: 'Rajesh Sharma', relation: 'Father', phone: '+91 9876543210', email: 'rajesh@example.com', students: 2 },
    { id: '2', name: 'Anita Desai', relation: 'Mother', phone: '+91 9123456780', email: 'anita.d@example.com', students: 1 },
];

export const Guardians = () => {

    const guardianColumns = [
        { header: 'Guardian Name', accessorKey: 'name' },
        { header: 'Relation', accessorKey: 'relation' },
        { header: 'Contact No.', accessorKey: 'phone' },
        { header: 'Email ID', accessorKey: 'email' },
        {
            header: 'Linked Students',
            accessorKey: 'students',
            cell: (item: any) => (
                <span className="student-count-badge">
                    {item.students} {item.students === 1 ? 'Child' : 'Children'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">View Profile</Button>
        },
    ];

    return (
        <div className="guardians-page animate-fade-in">
            <PageHeader
                title="Guardian Profiles"
                description="Manage parent and guardian profiles and contact information."
                actions={
                    <Button>+ Register Guardian</Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Registered Guardians</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table data={mockGuardians} columns={guardianColumns} />
                </CardContent>
            </Card>
        </div>
    );
};
