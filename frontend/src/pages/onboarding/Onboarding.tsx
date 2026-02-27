import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Onboarding.css';

// Mock Data
const mockTenants = [
    { id: '1', name: 'Global Education Trust', adminEmail: 'admin@globaledu.com', status: 'Active', schools: 5 },
    { id: '2', name: 'Sunrise Learning Society', adminEmail: 'ops@sunrise.org', status: 'Pending', schools: 1 },
];

export const Onboarding = () => {
    const [activeTab, setActiveTab] = useState<'tenants' | 'schools'>('tenants');

    const tenantColumns = [
        { header: 'Tenant Name', accessorKey: 'name' },
        { header: 'Admin Email', accessorKey: 'adminEmail' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        },
        { header: 'Schools #', accessorKey: 'schools' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Edit</Button>
        },
    ];

    return (
        <div className="onboarding-page animate-fade-in">
            <PageHeader
                title="Onboarding Management"
                description="Manage Multi-Tenant organizations and individual school branches."
                actions={
                    <Button>
                        {activeTab === 'tenants' ? '+ New Tenant' : '+ New School'}
                    </Button>
                }
            />

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'tenants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tenants')}
                >
                    Tenants (Organizations)
                </button>
                <button
                    className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schools')}
                >
                    School Branches
                </button>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>
                        {activeTab === 'tenants' ? 'Registered Tenants' : 'Registered Schools'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeTab === 'tenants' ? (
                        <Table data={mockTenants} columns={tenantColumns} />
                    ) : (
                        <div className="p-8 text-center text-secondary empty-state border border-dashed border-color rounded-md">
                            <p>Select a Tenant to view their schools or create a new School.</p>
                            <Button variant="secondary" className="mt-4">Setup First School</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
