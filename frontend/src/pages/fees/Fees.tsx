import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Fees.css';

// Mock Data
const mockTransactions = [
    { id: 'TRX-101', student: 'Aarav Sharma', amount: '₹12,500', date: '2025-04-10', method: 'Online Payment', status: 'Completed' },
    { id: 'TRX-102', student: 'Diya Desai', amount: '₹12,500', date: '2025-04-12', method: 'Bank Transfer', status: 'Pending Verification' },
];

export const Fees = () => {

    const transactionColumns = [
        { header: 'Transaction ID', accessorKey: 'id' },
        { header: 'Student Name', accessorKey: 'student' },
        { header: 'Amount Paid', accessorKey: 'amount' },
        { header: 'Date', accessorKey: 'date' },
        { header: 'Payment Method', accessorKey: 'method' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`fee-status ${item.status === 'Completed' ? 'completed' : 'pending'}`}>
                    {item.status}
                </span>
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
                description="Monitor recent transactions, pending verifications, and general fee collection health."
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
                        <p className="text-sm font-medium text-success-800 mb-1">Total Collected (This Month)</p>
                        <h2 className="text-3xl font-bold text-success-900">₹4,25,000</h2>
                    </CardContent>
                </Card>
                <Card className="bg-warning-50 border-warning-200">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-warning-800 mb-1">Pending Dues</p>
                        <h2 className="text-3xl font-bold text-warning-900">₹85,000</h2>
                    </CardContent>
                </Card>
                <Card className="bg-neutral-50 border-neutral-200">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-neutral-800 mb-1">Failed/Rejected</p>
                        <h2 className="text-3xl font-bold text-neutral-900">₹12,500</h2>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Recent Transactions</CardTitle>
                        <input
                            type="text"
                            placeholder="Search by TRX ID or Student..."
                            className="fee-search-input"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table data={mockTransactions} columns={transactionColumns} />
                </CardContent>
            </Card>
        </div>
    );
};
