import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { AuditLogOut } from '../../types';
import './AuditLogs.css';

const mockLogs: AuditLogOut[] = [
    { id: 1, actor: 'admin', action: 'notification_created', entity: 'notification', detail: 'Fee Reminder' },
    { id: 2, actor: 'system', action: 'notification_sent', entity: 'notification_dispatch', detail: '1' },
];

export const AuditLogs = () => {
    const [logs, setLogs] = useState<AuditLogOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<AuditLogOut[]>('/ops/audit-logs')
            .then(setLogs)
            .catch(() => setLogs(mockLogs))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Actor', accessorKey: 'actor' },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: (item: AuditLogOut) => <span className={`audit-badge action-${item.action.split('_')[1] || 'default'}`}>{item.action}</span>
        },
        { header: 'Entity', accessorKey: 'entity' },
        { header: 'Detail', accessorKey: 'detail' },
    ];

    return (
        <div className="audit-logs-page animate-fade-in">
            <PageHeader title="Audit Logs" description="Track all system activities and administrative actions." />
            <Card>
                <CardHeader><CardTitle>Activity Log ({logs.length} entries)</CardTitle></CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <Table data={logs} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
