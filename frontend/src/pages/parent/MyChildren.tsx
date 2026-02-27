import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchApi } from '../../services/api';
import type { ParentStudentSummaryOut } from '../../types';
import './MyChildren.css';

const mockChildren: ParentStudentSummaryOut[] = [
    { id: 1, admission_no: 'ADM-001', full_name: 'Aarav Sharma', class_name: 'Class X', section: 'A' },
    { id: 2, admission_no: 'ADM-007', full_name: 'Priya Sharma', class_name: 'Class VII', section: 'B' },
];

export const MyChildren = () => {
    const [children, setChildren] = useState<ParentStudentSummaryOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<ParentStudentSummaryOut[]>('/parent/students/1')
            .then(setChildren)
            .catch(() => setChildren(mockChildren))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="my-children-page animate-fade-in">
            <PageHeader title="My Children" description="View your children's profiles and academic details." />
            {loading ? (
                <div className="p-8 text-center text-secondary">Loading...</div>
            ) : (
                <div className="children-grid">
                    {children.map(child => (
                        <Card key={child.id} className="child-card hover-lift">
                            <CardContent className="p-6">
                                <div className="child-avatar">{child.full_name[0]}</div>
                                <h3 className="text-lg font-semibold mt-3">{child.full_name}</h3>
                                <p className="text-sm text-secondary">{child.class_name} - {child.section}</p>
                                <p className="text-xs text-secondary mt-1">Adm: {child.admission_no}</p>
                                <div className="child-actions mt-4">
                                    <Button size="sm" variant="secondary">Attendance</Button>
                                    <Button size="sm" variant="secondary">Grades</Button>
                                    <Button size="sm" variant="secondary">Fees</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
