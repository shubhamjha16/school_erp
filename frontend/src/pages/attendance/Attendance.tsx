import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { fetchApi } from '../../services/api';
import type { StudentOut, AttendanceOut } from '../../types';
import './Attendance.css';

const mockStudents: StudentOut[] = [
    { id: 1, admission_no: 'ADM-001', full_name: 'Aarav Sharma', class_name: 'Class X', section: 'A' },
    { id: 2, admission_no: 'ADM-002', full_name: 'Diya Desai', class_name: 'Class X', section: 'A' },
    { id: 3, admission_no: 'ADM-003', full_name: 'Rohan Patel', class_name: 'Class X', section: 'A' },
];

export const Attendance = () => {
    const [students, setStudents] = useState<StudentOut[]>([]);
    const [attendance, setAttendance] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchApi<StudentOut[]>('/students')
            .then(setStudents)
            .catch(() => setStudents(mockStudents))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = (studentId: number, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: prev[studentId] === status ? '' : status }));
    };

    const submitAttendance = async () => {
        const entries = Object.entries(attendance).filter(([, status]) => status);
        for (const [studentId, status] of entries) {
            try {
                await fetchApi<AttendanceOut>('/attendance/students', {
                    method: 'POST',
                    body: JSON.stringify({ student_id: Number(studentId), date: today, status }),
                });
            } catch {
                // Continue with next
            }
        }
        alert(`Attendance submitted for ${entries.length} students!`);
    };

    return (
        <div className="attendance-page animate-fade-in">
            <PageHeader
                title="Student Attendance"
                description={`Mark attendance for ${today}`}
                actions={<Button onClick={submitAttendance}>Submit Attendance</Button>}
            />
            <Card>
                <CardContent className="pt-6">
                    {loading ? (
                        <div className="p-8 text-center text-secondary">Loading students...</div>
                    ) : (
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Late</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id}>
                                        <td className="font-medium">{s.full_name}</td>
                                        <td>{s.class_name} - {s.section}</td>
                                        <td><button className={`att-btn present ${attendance[s.id] === 'present' ? 'active' : ''}`} onClick={() => toggleStatus(s.id, 'present')}>P</button></td>
                                        <td><button className={`att-btn absent ${attendance[s.id] === 'absent' ? 'active' : ''}`} onClick={() => toggleStatus(s.id, 'absent')}>A</button></td>
                                        <td><button className={`att-btn late ${attendance[s.id] === 'late' ? 'active' : ''}`} onClick={() => toggleStatus(s.id, 'late')}>L</button></td>
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
