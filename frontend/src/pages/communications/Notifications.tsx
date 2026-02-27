import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { fetchApi } from '../../services/api';
import type { NotificationOut } from '../../types';
import './Notifications.css';

const mockNotifications: NotificationOut[] = [
    { id: 1, audience: 'parents', channel: 'sms', title: 'Fee Reminder', message: 'Please clear pending dues by end of month.' },
    { id: 2, audience: 'all', channel: 'email', title: 'Annual Day Invite', message: 'You are invited to the Annual Day celebration.' },
];

export const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [audience, setAudience] = useState('all');
    const [channel, setChannel] = useState('sms');

    useEffect(() => {
        fetchApi<NotificationOut[]>('/notifications')
            .then(setNotifications)
            .catch(() => setNotifications(mockNotifications))
            .finally(() => setLoading(false));
    }, []);

    const handleSend = async () => {
        if (!title || !message) return;
        try {
            const newNotif = await fetchApi<NotificationOut>('/notifications', {
                method: 'POST',
                body: JSON.stringify({ audience, channel, title, message }),
            });
            setNotifications(prev => [newNotif, ...prev]);
            setTitle('');
            setMessage('');
        } catch {
            alert('Failed to send. Backend may be offline.');
        }
    };

    const columns = [
        { header: 'Title', accessorKey: 'title' },
        { header: 'Audience', accessorKey: 'audience' },
        { header: 'Channel', accessorKey: 'channel' },
        { header: 'Message', accessorKey: 'message' },
    ];

    return (
        <div className="notifications-page animate-fade-in">
            <PageHeader title="Communication Center" description="Compose and broadcast notifications to students, parents, or staff." />

            <Card className="mb-6">
                <CardHeader><CardTitle>Compose Notification</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1 block">Audience</label>
                                <select className="w-full input-field" value={audience} onChange={e => setAudience(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="parents">Parents</option>
                                    <option value="students">Students</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium mb-1 block">Channel</label>
                                <select className="w-full input-field" value={channel} onChange={e => setChannel(e.target.value)}>
                                    <option value="sms">SMS</option>
                                    <option value="email">Email</option>
                                    <option value="in_app">In-App</option>
                                </select>
                            </div>
                        </div>
                        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" />
                        <div>
                            <label className="text-sm font-medium mb-1 block">Message</label>
                            <textarea className="w-full input-field" rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." />
                        </div>
                        <Button onClick={handleSend}>Send Notification</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Sent Notifications ({notifications.length})</CardTitle></CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading...</div>
                    ) : (
                        <Table data={notifications} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
