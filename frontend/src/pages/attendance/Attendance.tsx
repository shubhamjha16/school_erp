import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import './Attendance.css';

// Mock Data
const mockRoster = [
    { id: '101', name: 'Aarav Sharma', roll: '1', status: 'present' },
    { id: '102', name: 'Diya Desai', roll: '2', status: 'absent' },
    { id: '103', name: 'Rohan Patel', roll: '3', status: 'present' },
    { id: '104', name: 'Isha Singh', roll: '4', status: 'late' },
    { id: '105', name: 'Karan Kumar', roll: '5', status: 'present' },
];

export const Attendance = () => {
    const [roster, setRoster] = useState(mockRoster);

    const markStatus = (id: string, status: string) => {
        setRoster(roster.map(student =>
            student.id === id ? { ...student, status } : student
        ));
    };

    const getStatusSummary = () => {
        const total = roster.length;
        const present = roster.filter(s => s.status === 'present').length;
        const absent = roster.filter(s => s.status === 'absent').length;
        const late = roster.filter(s => s.status === 'late').length;
        return { total, present, absent, late };
    };

    const summary = getStatusSummary();

    return (
        <div className="attendance-page animate-fade-in">
            <PageHeader
                title="Mark Attendance"
                description="Daily student attendance tracking for Class X-A (April 15, 2025)"
                actions={
                    <div className="flex gap-2">
                        <select className="class-selector">
                            <option>Class X - A</option>
                            <option>Class X - B</option>
                            <option>Class XI - Commerce</option>
                        </select>
                        <Button>Save Register</Button>
                    </div>
                }
            />

            <div className="attendance-layout">
                <div className="main-roster">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="roster-grid">
                                <div className="roster-header">
                                    <div className="col-roll">Roll No.</div>
                                    <div className="col-name">Student Name</div>
                                    <div className="col-status">Attendance Status</div>
                                </div>

                                {roster.map(student => (
                                    <div key={student.id} className="roster-row hover-lift">
                                        <div className="col-roll font-medium">{student.roll}</div>
                                        <div className="col-name font-semibold">{student.name}</div>
                                        <div className="col-status">
                                            <div className="status-toggle">
                                                <button
                                                    onClick={() => markStatus(student.id, 'present')}
                                                    className={`toggle-btn present ${student.status === 'present' ? 'active' : ''}`}
                                                >
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => markStatus(student.id, 'absent')}
                                                    className={`toggle-btn absent ${student.status === 'absent' ? 'active' : ''}`}
                                                >
                                                    Absent
                                                </button>
                                                <button
                                                    onClick={() => markStatus(student.id, 'late')}
                                                    className={`toggle-btn late ${student.status === 'late' ? 'active' : ''}`}
                                                >
                                                    Late
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="attendance-sidebar">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-lg mb-4">Today's Summary</h3>

                            <div className="summary-stats">
                                <div className="stat-card total">
                                    <span className="stat-label">Total Strength</span>
                                    <span className="stat-value">{summary.total}</span>
                                </div>

                                <div className="stat-card present">
                                    <span className="stat-label">Present</span>
                                    <span className="stat-value">{summary.present}</span>
                                </div>

                                <div className="stat-card absent">
                                    <span className="stat-label">Absent</span>
                                    <span className="stat-value">{summary.absent}</span>
                                </div>

                                <div className="stat-card late">
                                    <span className="stat-label">Late</span>
                                    <span className="stat-value">{summary.late}</span>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-color pt-4">
                                <label className="text-sm font-medium mb-2 block">Class Notes</label>
                                <textarea
                                    className="w-full input-field min-h-[100px]"
                                    placeholder="Any remarks for today's session..."
                                ></textarea>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
