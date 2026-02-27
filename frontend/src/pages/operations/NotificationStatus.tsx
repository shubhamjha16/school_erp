import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import './NotificationStatus.css';

const mockJobs = [
    { id: 'JOB-001', type: 'SMS Broadcast', target: 'Class X Parents (42)', triggeredBy: 'admin@schooleye.in', startedAt: '14:30:00', status: 'completed', sent: 42, failed: 0 },
    { id: 'JOB-002', type: 'Email Campaign', target: 'All Staff (84)', triggeredBy: 'admin@schooleye.in', startedAt: '14:35:00', status: 'completed', sent: 82, failed: 2 },
    { id: 'JOB-003', type: 'Fee Reminder SMS', target: 'Defaulters (18)', triggeredBy: 'CRON Scheduler', startedAt: '09:00:00', status: 'in-progress', sent: 12, failed: 0 },
    { id: 'JOB-004', type: 'Push Notification', target: 'Parent App Users', triggeredBy: 'admin@schooleye.in', startedAt: '15:00:00', status: 'failed', sent: 0, failed: 156 },
];

const statusIcons: Record<string, any> = {
    completed: { icon: CheckCircle, color: 'success' },
    'in-progress': { icon: Clock, color: 'warning' },
    failed: { icon: XCircle, color: 'danger' },
};

export const NotificationStatus = () => {
    const completedCount = mockJobs.filter(j => j.status === 'completed').length;
    const failedCount = mockJobs.filter(j => j.status === 'failed').length;
    const inProgressCount = mockJobs.filter(j => j.status === 'in-progress').length;

    return (
        <div className="notif-status-page animate-fade-in">
            <PageHeader
                title="Async Notification Jobs"
                description="Monitor the delivery status of SMS, Email, and Push notification batches."
                actions={<Button variant="secondary">Refresh Status</Button>}
            />

            <div className="notif-summary-grid mb-6">
                <Card className="notif-summary-card">
                    <CardContent className="notif-summary-content">
                        <CheckCircle size={24} className="text-success" />
                        <div>
                            <p className="notif-summary-label">Completed</p>
                            <h3 className="notif-summary-value">{completedCount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="notif-summary-card">
                    <CardContent className="notif-summary-content">
                        <Clock size={24} className="text-warning" />
                        <div>
                            <p className="notif-summary-label">In Progress</p>
                            <h3 className="notif-summary-value">{inProgressCount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="notif-summary-card">
                    <CardContent className="notif-summary-content">
                        <XCircle size={24} className="text-danger" />
                        <div>
                            <p className="notif-summary-label">Failed</p>
                            <h3 className="notif-summary-value">{failedCount}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="jobs-list">
                {mockJobs.map(job => {
                    const statusInfo = statusIcons[job.status];
                    const StatusIcon = statusInfo.icon;
                    return (
                        <Card key={job.id} className="job-card mb-4 hover-lift">
                            <CardContent className="job-card-content">
                                <div className="job-header">
                                    <div className="job-id-type">
                                        <span className="job-id">{job.id}</span>
                                        <h4 className="job-type">{job.type}</h4>
                                    </div>
                                    <div className={`job-status-pill ${statusInfo.color}`}>
                                        <StatusIcon size={16} />
                                        <span>{job.status.replace('-', ' ')}</span>
                                    </div>
                                </div>

                                <div className="job-details-row">
                                    <div className="job-detail">
                                        <span className="job-detail-label">Target</span>
                                        <span className="job-detail-value">{job.target}</span>
                                    </div>
                                    <div className="job-detail">
                                        <span className="job-detail-label">Triggered By</span>
                                        <span className="job-detail-value">{job.triggeredBy}</span>
                                    </div>
                                    <div className="job-detail">
                                        <span className="job-detail-label">Started At</span>
                                        <span className="job-detail-value">{job.startedAt}</span>
                                    </div>
                                    <div className="job-detail">
                                        <span className="job-detail-label">Sent / Failed</span>
                                        <span className="job-detail-value">
                                            <span className="text-success font-bold">{job.sent}</span> / <span className="text-danger font-bold">{job.failed}</span>
                                        </span>
                                    </div>
                                </div>

                                {job.status === 'failed' && (
                                    <div className="job-error-banner">
                                        <AlertTriangle size={16} />
                                        <span>Delivery failed — check SMTP/gateway configuration and retry.</span>
                                        <Button size="sm" variant="danger">Retry Job</Button>
                                    </div>
                                )}

                                {job.status === 'in-progress' && (
                                    <div className="job-progress-bar">
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: `${(job.sent / 18) * 100}%` }}></div>
                                        </div>
                                        <span className="progress-label">{Math.round((job.sent / 18) * 100)}%</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
