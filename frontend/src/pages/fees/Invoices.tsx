import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FileText, Download, Send } from 'lucide-react';
import './Invoices.css';

// Mock Data
const mockInvoices = [
    { id: 'INV-2025-001', student: 'Aarav Sharma', class: 'Class X-A', type: 'Tuition Fee (Q1)', amount: '₹12,500', dueDate: '2025-04-15', status: 'Paid' },
    { id: 'INV-2025-002', student: 'Diya Desai', class: 'Class XI-B', type: 'Tuition Fee (Q1)', amount: '₹14,000', dueDate: '2025-04-15', status: 'Overdue' },
    { id: 'INV-2025-003', student: 'Rohan Patel', class: 'Class X-A', type: 'Transport Fee (Apr)', amount: '₹2,500', dueDate: '2025-04-20', status: 'Unpaid' },
];

export const Invoices = () => {
    const invoiceColumns = [
        { header: 'Invoice #', accessorKey: 'id' },
        { header: 'Student', accessorKey: 'student' },
        { header: 'Fee Type', accessorKey: 'type' },
        { header: 'Amount', accessorKey: 'amount' },
        { header: 'Due Date', accessorKey: 'dueDate' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`invoice-status ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" title="View"><FileText size={16} /></Button>
                    <Button variant="ghost" size="sm" title="Download"><Download size={16} /></Button>
                    <Button variant="ghost" size="sm" title="Send Reminder"><Send size={16} /></Button>
                </div>
            )
        },
    ];

    return (
        <div className="invoices-page animate-fade-in">
            <PageHeader
                title="Invoice Management"
                description="Generate, track, and send reminders for student fee invoices."
                actions={
                    <Button>+ Generate New Invoices</Button>
                }
            />

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Filter by Class/Section</label>
                            <select className="w-full input-field"><option>All Classes</option></select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Fee Type</label>
                            <select className="w-full input-field"><option>All Fee Types</option></select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <select className="w-full input-field"><option>Any Status</option></select>
                        </div>
                        <Button variant="secondary">Apply Filters</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Generated Invoices</CardTitle>
                        <Button variant="secondary" size="sm">Send Bulk Reminders</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table data={mockInvoices} columns={invoiceColumns} />
                </CardContent>
            </Card>

        </div>
    );
};
