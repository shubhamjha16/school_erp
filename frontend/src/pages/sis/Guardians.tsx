import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { GuardianOut } from '../../types';
import './Guardians.css';

const mockGuardians: GuardianOut[] = [
    { id: 1, full_name: 'Rajesh Sharma', phone: '+91-9876543210', relation: 'Father' },
    { id: 2, full_name: 'Priya Desai', phone: '+91-9123456789', relation: 'Mother' },
];

export const Guardians = () => {
    const [guardians, setGuardians] = useState<GuardianOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<GuardianOut[]>('/sis/guardians')
            .then(setGuardians)
            .catch(() => setGuardians(mockGuardians))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Full Name', accessorKey: 'full_name' },
        { header: 'Phone', accessorKey: 'phone' },
        { header: 'Relation', accessorKey: 'relation' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Link Student</Button>
                </div>
            )
        },
    ];

    return (
        <div className="guardians-page animate-fade-in">
            <PageHeader
                title="Guardian Management"
                description="Manage parent and guardian profiles and student relationships."
                actions={<Button>+ Add Guardian</Button>}
            />
            <Card>
                <CardHeader>
                    <CardTitle>All Guardians ({guardians.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <Table data={guardians} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
