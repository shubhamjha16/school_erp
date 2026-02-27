import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './AuditLogs.css';

const mockLogs = [
    { id: '1', timestamp: '2025-04-15 14:32:01', user: 'admin@schooleye.in', role: 'Super Admin', action: 'LOGIN', resource: 'Auth', details: 'Successful login from 192.168.1.10', severity: 'Info' },
    { id: '2', timestamp: '2025-04-15 14:35:22', user: 'admin@schooleye.in', role: 'Super Admin', action: 'CREATE', resource: 'Student', details: 'Created student Aarav Sharma (ID: 101)', severity: 'Info' },
    { id: '3', timestamp: '2025-04-15 15:01:10', user: 'teacher@schooleye.in', role: 'Teacher', action: 'UPDATE', resource: 'Attendance', details: 'Marked attendance for Class X-A', severity: 'Info' },
    { id: '4', timestamp: '2025-04-15 15:30:00', user: 'system', role: 'System', action: 'CRON', resource: 'Notifications', details: 'Fee reminder batch sent (45 SMS)', severity: 'Warning' },
    { id: '5', timestamp: '2025-04-14 09:00:00', user: 'admin@schooleye.in', role: 'Super Admin', action: 'DELETE', resource: 'Tenant', details: 'Attempted deletion of Sunrise Learning (denied)', severity: 'Critical' },
];

export const AuditLogs = () => {
    const [severityFilter, setSeverityFilter] = useState('all');

    const filtered = severityFilter === 'all'
        ? mockLogs
        : mockLogs.filter(l => l.severity.toLowerCase() === severityFilter);

    const logColumns = [
        { header: 'Timestamp', accessorKey: 'timestamp' },
        { header: 'User', accessorKey: 'user' },
        { header: 'Role', accessorKey: 'role' },
        {
            header: 'Action', accessorKey: 'action',
            cell: (item: any) => <span className={`action-badge ${item.action.toLowerCase()}`}>{item.action}</span>
        },
        { header: 'Resource', accessorKey: 'resource' },
        { header: 'Details', accessorKey: 'details' },
        {
            header: 'Severity', accessorKey: 'severity',
            cell: (item: any) => <span className={`severity-badge ${item.severity.toLowerCase()}`}>{item.severity}</span>
        },
    ];

    return (
        <div className="audit-logs-page animate-fade-in">
            <PageHeader
                title="Audit Logs"
                description="System-wide activity log for compliance and security monitoring."
                actions={<Button variant="secondary">Export CSV</Button>}
            />

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Filter by Severity</label>
                            <select className="w-full input-field" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                                <option value="all">All Severities</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Filter by Action</label>
                            <select className="w-full input-field">
                                <option>All Actions</option>
                                <option>LOGIN</option>
                                <option>CREATE</option>
                                <option>UPDATE</option>
                                <option>DELETE</option>
                                <option>CRON</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Date Range</label>
                            <input type="date" className="w-full input-field" />
                        </div>
                        <Button>Apply Filters</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>Activity Log ({filtered.length} entries)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table data={filtered} columns={logColumns} />
                </CardContent>
            </Card>
        </div>
    );
};
