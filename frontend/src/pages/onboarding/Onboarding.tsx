import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { TenantOut, SchoolOut } from '../../types';
import './Onboarding.css';

// Fallback mock data
const mockTenants = [
    { id: 1, name: 'Global Education Trust' },
    { id: 2, name: 'Sunrise Learning Society' },
];
const mockSchools: SchoolOut[] = [
    { id: 1, tenant_id: 1, name: 'SchoolEye Academy - Main Branch', code: 'SE-001' },
];

export const Onboarding = () => {
    const [activeTab, setActiveTab] = useState<'tenants' | 'schools'>('tenants');
    const [tenants, setTenants] = useState<TenantOut[]>([]);
    const [schools, setSchools] = useState<SchoolOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [t, s] = await Promise.all([
                    fetchApi<TenantOut[]>('/onboarding/tenants'),
                    fetchApi<SchoolOut[]>('/onboarding/schools'),
                ]);
                setTenants(t);
                setSchools(s);
            } catch {
                setTenants(mockTenants);
                setSchools(mockSchools);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const tenantColumns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Tenant Name', accessorKey: 'name' },
        {
            header: 'Schools',
            accessorKey: 'id',
            cell: (item: TenantOut) => <span>{schools.filter(s => s.tenant_id === item.id).length}</span>
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => <Button variant="ghost" size="sm">Edit</Button>
        },
    ];

    const schoolColumns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'School Name', accessorKey: 'name' },
        { header: 'Code', accessorKey: 'code' },
        {
            header: 'Tenant',
            accessorKey: 'tenant_id',
            cell: (item: SchoolOut) => <span>{tenants.find(t => t.id === item.tenant_id)?.name || `Tenant #${item.tenant_id}`}</span>
        },
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
                    Tenants ({tenants.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schools')}
                >
                    School Branches ({schools.length})
                </button>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>
                        {activeTab === 'tenants' ? 'Registered Tenants' : 'Registered Schools'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : activeTab === 'tenants' ? (
                        <Table data={tenants} columns={tenantColumns} />
                    ) : (
                        <Table data={schools} columns={schoolColumns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
