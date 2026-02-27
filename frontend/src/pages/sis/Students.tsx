import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { StudentOut } from '../../types';
import './Students.css';

const mockStudents: StudentOut[] = [
    { id: 1, admission_no: 'ADM-2025-001', full_name: 'Aarav Sharma', class_name: 'Class X', section: 'A' },
    { id: 2, admission_no: 'ADM-2025-002', full_name: 'Diya Desai', class_name: 'Class X', section: 'A' },
];

export const Students = () => {
    const [students, setStudents] = useState<StudentOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<StudentOut[]>('/students')
            .then(setStudents)
            .catch(() => setStudents(mockStudents))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: 'Adm. No', accessorKey: 'admission_no' },
        { header: 'Full Name', accessorKey: 'full_name' },
        { header: 'Class', accessorKey: 'class_name' },
        { header: 'Section', accessorKey: 'section' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">View Profile</Button>
        },
    ];

    return (
        <div className="students-page animate-fade-in">
            <PageHeader
                title="Student Information System"
                description="Manage student profiles, enrollment, and academic records."
                actions={<Button>+ Enrol Student</Button>}
            />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>All Students ({students.length})</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <Table data={students} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
