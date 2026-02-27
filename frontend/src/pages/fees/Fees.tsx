import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { FeeInvoiceOut, FeePaymentOut } from '../../types';
import './Fees.css';

const mockInvoices: FeeInvoiceOut[] = [
    { id: 1, student_id: 1, term: 'Term 1', amount_due: 12500, status: 'paid' },
    { id: 2, student_id: 2, term: 'Term 1', amount_due: 12500, status: 'due' },
];

export const Fees = () => {
    const [invoices, setInvoices] = useState<FeeInvoiceOut[]>([]);
    const [payments, setPayments] = useState<FeePaymentOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [inv, pay] = await Promise.all([
                    fetchApi<FeeInvoiceOut[]>('/fees/invoices'),
                    fetchApi<FeePaymentOut[]>('/fees/payments'),
                ]);
                setInvoices(inv);
                setPayments(pay);
            } catch {
                setInvoices(mockInvoices);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalCollected = payments.reduce((sum, p) => sum + p.amount_paid, 0);
    const totalDue = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount_due, 0);

    const columns = [
        { header: 'Invoice #', accessorKey: 'id' },
        { header: 'Student ID', accessorKey: 'student_id' },
        { header: 'Term', accessorKey: 'term' },
        { header: 'Amount Due', accessorKey: 'amount_due', cell: (item: FeeInvoiceOut) => <span>₹{item.amount_due.toLocaleString()}</span> },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: FeeInvoiceOut) => (
                <span className={`fee-status ${item.status === 'paid' ? 'completed' : 'pending'}`}>{item.status}</span>
            )
        },
        {
            header: 'Receipt',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Download</Button>
        },
    ];

    return (
        <div className="fees-page animate-fade-in">
            <PageHeader
                title="Fees Collections"
                description="Monitor invoices, payments, and fee collection health."
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary">Invoices</Button>
                        <Button>+ Record Offline Payment</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-success-50 border-success-200">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-success-800 mb-1">Total Collected</p>
                        <h2 className="text-3xl font-bold text-success-900">₹{totalCollected.toLocaleString()}</h2>
                    </CardContent>
                </Card>
                <Card className="bg-warning-50 border-warning-200">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-warning-800 mb-1">Pending Dues</p>
                        <h2 className="text-3xl font-bold text-warning-900">₹{totalDue.toLocaleString()}</h2>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-50 border-neutral-200">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-neutral-800 mb-1">Total Invoices</p>
                        <h2 className="text-3xl font-bold text-neutral-900">{invoices.length}</h2>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fee Invoices ({invoices.length})</CardTitle>
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
