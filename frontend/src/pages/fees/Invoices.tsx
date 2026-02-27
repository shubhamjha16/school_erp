import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { FeeInvoiceOut } from '../../types';
import './Invoices.css';

const mockInvoices: FeeInvoiceOut[] = [
    { id: 1, student_id: 1, term: 'Term 1', amount_due: 12500, status: 'paid' },
    { id: 2, student_id: 2, term: 'Term 1', amount_due: 12500, status: 'due' },
];

export const Invoices = () => {
    const [invoices, setInvoices] = useState<FeeInvoiceOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<FeeInvoiceOut[]>('/fees/invoices')
            .then(setInvoices)
            .catch(() => setInvoices(mockInvoices))
            .finally(() => setLoading(false));
    }, []);

    const handleCreateInvoice = async () => {
        const studentId = prompt('Student ID:');
        const amount = prompt('Amount due:');
        if (!studentId || !amount) return;
        try {
            const newInv = await fetchApi<FeeInvoiceOut>('/fees/invoices', {
                method: 'POST',
                body: JSON.stringify({ student_id: Number(studentId), term: 'Term 1', amount_due: Number(amount), status: 'due' }),
            });
            setInvoices(prev => [newInv, ...prev]);
        } catch {
            alert('Failed to create invoice. Backend may be offline.');
        }
    };

    const columns = [
        { header: 'Invoice #', accessorKey: 'id' },
        { header: 'Student ID', accessorKey: 'student_id' },
        { header: 'Term', accessorKey: 'term' },
        { header: 'Amount Due', accessorKey: 'amount_due', cell: (item: FeeInvoiceOut) => <span>₹{item.amount_due.toLocaleString()}</span> },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: FeeInvoiceOut) => (
                <span className={`invoice-status ${item.status === 'paid' ? 'paid' : item.status === 'partial' ? 'partial' : 'due'}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Record Payment</Button>
                    <Button variant="ghost" size="sm">Send Reminder</Button>
                </div>
            )
        },
    ];

    return (
        <div className="invoices-page animate-fade-in">
            <PageHeader
                title="Invoice Management"
                description="Generate, track, and manage fee invoices."
                actions={<Button onClick={handleCreateInvoice}>+ Generate Invoice</Button>}
            />
            <Card>
                <CardHeader>
                    <CardTitle>All Invoices ({invoices.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <Table data={invoices} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
