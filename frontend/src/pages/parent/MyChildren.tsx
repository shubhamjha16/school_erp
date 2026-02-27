import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import './MyChildren.css';

const mockChildren = [
    {
        id: '101',
        name: 'Aarav Sharma',
        photo: null,
        class: 'Class X - Section A',
        roll: '1',
        attendance: '92%',
        lastExamGrade: 'A (84%)',
        feeStatus: 'Paid',
    },
    {
        id: '104',
        name: 'Ishaan Sharma',
        photo: null,
        class: 'Class V - Section B',
        roll: '14',
        attendance: '97%',
        lastExamGrade: 'A+ (95%)',
        feeStatus: 'Due Apr 20',
    },
];

export const MyChildren = () => {
    return (
        <div className="my-children-page animate-fade-in">
            <PageHeader
                title="My Children"
                description="View enrolled students linked to your guardian profile."
            />

            <div className="children-grid">
                {mockChildren.map(child => (
                    <Card key={child.id} className="child-card hover-lift">
                        <CardContent className="child-card-content">
                            <div className="child-avatar">
                                {child.name.charAt(0)}
                            </div>
                            <h3 className="child-name">{child.name}</h3>
                            <span className="child-class">{child.class}</span>
                            <span className="child-roll">Roll No: {child.roll}</span>

                            <div className="child-stats">
                                <div className="child-stat">
                                    <span className="child-stat-label">Attendance</span>
                                    <span className="child-stat-value success">{child.attendance}</span>
                                </div>
                                <div className="child-stat">
                                    <span className="child-stat-label">Last Exam</span>
                                    <span className="child-stat-value primary">{child.lastExamGrade}</span>
                                </div>
                                <div className="child-stat">
                                    <span className="child-stat-label">Fee Status</span>
                                    <span className={`child-stat-value ${child.feeStatus === 'Paid' ? 'success' : 'warning'}`}>{child.feeStatus}</span>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full mt-4">View Full Profile</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
