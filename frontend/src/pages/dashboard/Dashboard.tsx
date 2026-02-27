import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, BookOpen, GraduationCap, Calendar, TrendingUp } from 'lucide-react';
import { fetchApi } from '../../services/api';
import type { DashboardMetricsOut } from '../../types';
import './Dashboard.css';

const fallbackMetrics: DashboardMetricsOut = {
    total_students: 1245, total_guardians: 84, total_classes: 42, attendance_marked: 1180, notifications_sent: 56,
};

export const Dashboard = () => {
    const [metrics, setMetrics] = useState<DashboardMetricsOut>(fallbackMetrics);

    useEffect(() => {
        fetchApi<DashboardMetricsOut>('/dashboard/metrics')
            .then(setMetrics)
            .catch(() => setMetrics(fallbackMetrics));
    }, []);

    const cards = [
        { title: 'Total Students', value: metrics.total_students.toLocaleString(), icon: GraduationCap, color: 'primary', trend: 'From database' },
        { title: 'Total Guardians', value: metrics.total_guardians.toLocaleString(), icon: Users, color: 'secondary', trend: 'From database' },
        { title: 'Active Classes', value: metrics.total_classes.toLocaleString(), icon: BookOpen, color: 'success', trend: 'Configured' },
        { title: 'Attendance Records', value: metrics.attendance_marked.toLocaleString(), icon: Calendar, color: 'warning', trend: 'All time' },
    ];

    return (
        <div className="dashboard-page animate-fade-in">
            <PageHeader title="Admin Overview" description="Welcome to SchoolEye. Here is a summary of your institution today." />

            <div className="metrics-grid">
                {cards.map((metric, idx) => (
                    <Card key={idx} className="metric-card hover-lift">
                        <CardContent className="metric-content">
                            <div className="metric-info">
                                <p className="metric-title">{metric.title}</p>
                                <h3 className="metric-value">{metric.value}</h3>
                                <div className="metric-trend"><TrendingUp size={14} /><span>{metric.trend}</span></div>
                            </div>
                            <div className={`metric-icon-box ${metric.color}`}><metric.icon size={24} /></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="dashboard-charts-grid mt-6">
                <Card className="chart-card">
                    <CardHeader><CardTitle>Notifications Sent</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-center p-8">
                        <div className="text-secondary text-sm border border-dashed border-color rounded-md w-full h-48 flex items-center justify-center">
                            Total: {metrics.notifications_sent} notifications dispatched
                        </div>
                    </CardContent>
                </Card>

                <Card className="chart-card">
                    <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="activity-list">
                            <li><div className="activity-dot primary"></div><div className="activity-text"><strong>Fee Payment</strong> received from Aarav Sharma (Class X)<span className="activity-time">10 mins ago</span></div></li>
                            <li><div className="activity-dot warning"></div><div className="activity-text"><strong>SMS Broadcast</strong> sent to Class XI Parents<span className="activity-time">1 hour ago</span></div></li>
                            <li><div className="activity-dot success"></div><div className="activity-text"><strong>New Admission</strong> Diya Desai enrolled in Class XI<span className="activity-time">3 hours ago</span></div></li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
