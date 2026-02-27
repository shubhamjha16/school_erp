import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { GraduationCap, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import './ParentDashboard.css';

const childMetrics = [
    { title: 'Attendance (This Month)', value: '92%', icon: Calendar, color: 'success', detail: '23 / 25 days present' },
    { title: 'Upcoming Exams', value: '2', icon: GraduationCap, color: 'primary', detail: 'Mid-Term starts Sept 15' },
    { title: 'Fee Status', value: 'Paid', icon: CreditCard, color: 'success', detail: 'Q1 Tuition ₹12,500' },
    { title: 'Class Rank', value: '#3', icon: TrendingUp, color: 'warning', detail: 'Out of 42 students' },
];

const recentUpdates = [
    { type: 'attendance', text: 'Aarav was marked Present today.', time: '2 hours ago' },
    { type: 'fee', text: 'Q1 Tuition Fee payment confirmed (₹12,500).', time: '2 days ago' },
    { type: 'exam', text: 'Mid-Term Examination schedule published.', time: '5 days ago' },
    { type: 'notice', text: 'Holiday announced on Apr 14 (Ambedkar Jayanti).', time: '1 week ago' },
];

export const ParentDashboard = () => {
    return (
        <div className="parent-dashboard animate-fade-in">
            <PageHeader
                title="Welcome, Rajesh 👋"
                description="Here's an overview of Aarav Sharma's progress at SchoolEye."
            />

            <div className="parent-metrics-grid">
                {childMetrics.map((metric, idx) => (
                    <Card key={idx} className="parent-metric-card hover-lift">
                        <CardContent className="parent-metric-content">
                            <div className={`parent-metric-icon-box ${metric.color}`}>
                                <metric.icon size={22} />
                            </div>
                            <div className="parent-metric-info">
                                <p className="parent-metric-title">{metric.title}</p>
                                <h3 className="parent-metric-value">{metric.value}</h3>
                                <span className="parent-metric-detail">{metric.detail}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="parent-dashboard-grid mt-6">
                <Card>
                    <CardHeader><CardTitle>Recent Updates</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="parent-updates-list">
                            {recentUpdates.map((update, idx) => (
                                <li key={idx} className="parent-update-item">
                                    <div className={`update-dot ${update.type}`}></div>
                                    <div className="update-content">
                                        <p>{update.text}</p>
                                        <span className="update-time">{update.time}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent>
                        <div className="quick-actions-grid">
                            <button className="quick-action-btn hover-lift">
                                <Calendar size={24} />
                                <span>View Attendance</span>
                            </button>
                            <button className="quick-action-btn hover-lift">
                                <GraduationCap size={24} />
                                <span>Exam Results</span>
                            </button>
                            <button className="quick-action-btn hover-lift">
                                <CreditCard size={24} />
                                <span>Pay Fees</span>
                            </button>
                            <button className="quick-action-btn hover-lift">
                                <TrendingUp size={24} />
                                <span>Report Card</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
