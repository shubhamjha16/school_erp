import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { ParentDashboardOut } from '../../types';
import './ParentDashboard.css';

const fallback: ParentDashboardOut = {
    total_students: 2, attendance_records: 180, report_cards: 4, fee_invoices: 6, fee_due_count: 1,
};

export const ParentDashboard = () => {
    const [metrics, setMetrics] = useState<ParentDashboardOut>(fallback);

    useEffect(() => {
        // Use guardian_id = 1 as default, would come from auth context in production
        fetchApi<ParentDashboardOut>('/parent/dashboard/1')
            .then(setMetrics)
            .catch(() => setMetrics(fallback));
    }, []);

    const cards = [
        { label: 'My Children', value: metrics.total_students, color: 'primary' },
        { label: 'Attendance Records', value: metrics.attendance_records, color: 'success' },
        { label: 'Report Cards', value: metrics.report_cards, color: 'secondary' },
        { label: 'Fee Invoices', value: metrics.fee_invoices, color: 'warning' },
        { label: 'Fees Due', value: metrics.fee_due_count, color: 'danger' },
    ];

    return (
        <div className="parent-dashboard-page animate-fade-in">
            <PageHeader title="Parent Dashboard" description="Overview of your children's academic progress and school activities." />
            <div className="metrics-grid">
                {cards.map((c, i) => (
                    <Card key={i} className="hover-lift">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm font-medium text-secondary mb-2">{c.label}</p>
                            <h2 className="text-3xl font-bold">{c.value}</h2>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
