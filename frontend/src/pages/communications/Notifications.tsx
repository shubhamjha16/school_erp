import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import './Notifications.css';

// Mock Data
const mockHistory = [
    { id: '1', type: 'SMS', recipient: 'Class X Parents', message: 'Tomorrow is a holiday due to local elections.', status: 'Sent', date: '2025-04-14 14:30' },
    { id: '2', type: 'Email', recipient: 'Staff', message: 'Monthly staff meeting scheduled for Friday.', status: 'Sent', date: '2025-04-12 09:00' },
];

export const Notifications = () => {
    const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

    return (
        <div className="notifications-page animate-fade-in">
            <PageHeader
                title="Communication Center"
                description="Send SMS, Emails, and App Notifications to Students, Parents, and Staff."
            />

            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
                    onClick={() => setActiveTab('compose')}
                >
                    Compose Message
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Message History
                </button>
            </div>

            {activeTab === 'compose' ? (
                <div className="compose-grid">
                    <Card className="compose-card">
                        <CardHeader>
                            <CardTitle>New Broadcast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Message Type</label>
                                    <select className="w-full input-field">
                                        <option>SMS Text Message</option>
                                        <option>Email</option>
                                        <option>In-App Push Info</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Recipient Group</label>
                                    <select className="w-full input-field">
                                        <option>All Parents</option>
                                        <option>Specific Class/Section</option>
                                        <option>All Staff</option>
                                        <option>Defaulters Only</option>
                                    </select>
                                </div>
                            </div>

                            <Input label="Subject (For Email)" placeholder="Enter subject line..." className="mb-4" />

                            <div className="mb-4">
                                <label className="text-sm font-medium mb-1 block">Message Body</label>
                                <textarea
                                    className="w-full input-field min-h-[150px]"
                                    placeholder="Type your message here. For SMS, keep it under 160 characters."
                                ></textarea>
                                <div className="text-right text-xs text-secondary mt-1">Characters: 0 / 160</div>
                            </div>

                        </CardContent>
                        <CardFooter className="justify-end gap-3">
                            <Button variant="secondary">Save Draft</Button>
                            <Button>Send Broadcast Now</Button>
                        </CardFooter>
                    </Card>

                    <Card className="templates-card">
                        <CardHeader>
                            <CardTitle>Quick Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="template-list">
                                <li className="template-item">Fee Reminder (Due in 3 days)</li>
                                <li className="template-item">Exam Schedule Announcement</li>
                                <li className="template-item">Unexpected Holiday Notice</li>
                                <li className="template-item">PTM Invitation</li>
                            </ul>
                            <Button variant="ghost" className="w-full mt-4 bg-surface hover-lift">Manage Templates</Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="history-list">
                            <div className="history-header">
                                <div className="w-1/6">Date / Time</div>
                                <div className="w-1/6">Type</div>
                                <div className="w-1/4">Recipient</div>
                                <div className="w-1/3">Message Snip</div>
                                <div className="w-1/12 text-right">Status</div>
                            </div>

                            {mockHistory.map(log => (
                                <div key={log.id} className="history-row hover-lift">
                                    <div className="w-1/6 text-secondary text-sm">{log.date}</div>
                                    <div className="w-1/6 font-medium">{log.type}</div>
                                    <div className="w-1/4">{log.recipient}</div>
                                    <div className="w-1/3 text-secondary truncate pr-4">{log.message}</div>
                                    <div className="w-1/12 text-right">
                                        <span className="status-badge active">{log.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
