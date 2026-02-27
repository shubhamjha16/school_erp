import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchApi } from '../../services/api';
import type { NotificationDispatchOut } from '../../types';
import './NotificationStatus.css';

const mockDispatches: NotificationDispatchOut[] = [
    { id: 1, notification_id: 1, status: 'sent' },
    { id: 2, notification_id: 1, status: 'queued' },
];

export const NotificationStatus = () => {
    const [dispatches, setDispatches] = useState<NotificationDispatchOut[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApi<NotificationDispatchOut[]>('/notifications/queue')
            .then(setDispatches)
            .catch(() => setDispatches(mockDispatches))
            .finally(() => setLoading(false));
    }, []);

    const getIcon = (status: string) => {
        switch (status) {
            case 'sent': return <CheckCircle size={18} className="text-success" />;
            case 'failed': return <XCircle size={18} className="text-danger" />;
            default: return <Clock size={18} className="text-warning" />;
        }
    };

    const sent = dispatches.filter(d => d.status === 'sent').length;
    const queued = dispatches.filter(d => d.status === 'queued').length;
    const failed = dispatches.filter(d => d.status === 'failed').length;

    return (
        <div className="notification-status-page animate-fade-in">
            <PageHeader
                title="Notification Jobs"
                description="Monitor the delivery status of dispatched notifications."
                actions={<Button variant="secondary" onClick={() => window.location.reload()}>Refresh</Button>}
            />

            <div className="stats-row mb-6">
                <Card className="stat-card"><CardContent className="p-4 text-center"><p className="text-sm text-secondary">Sent</p><h3 className="text-2xl font-bold text-success">{sent}</h3></CardContent></Card>
                <Card className="stat-card"><CardContent className="p-4 text-center"><p className="text-sm text-secondary">Queued</p><h3 className="text-2xl font-bold text-warning">{queued}</h3></CardContent></Card>
                <Card className="stat-card"><CardContent className="p-4 text-center"><p className="text-sm text-secondary">Failed</p><h3 className="text-2xl font-bold text-danger">{failed}</h3></CardContent></Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <table className="dispatch-table">
                            <thead>
                                <tr><th>ID</th><th>Notification</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {dispatches.map(d => (
                                    <tr key={d.id}>
                                        <td>#{d.id}</td>
                                        <td>Notification #{d.notification_id}</td>
                                        <td className="flex items-center gap-2">{getIcon(d.status)} {d.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
