import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import './Exams.css';

// Mock Data
const mockExams = [
    { id: '1', name: 'Mid-Term Examination', term: 'Term 1', startDate: '2025-09-15', status: 'Upcoming' },
    { id: '2', name: 'Unit Test 1', term: 'Term 1', startDate: '2025-07-20', status: 'Completed' },
];

export const Exams = () => {
    const examColumns = [
        { header: 'Exam Name', accessorKey: 'name' },
        { header: 'Term/Session', accessorKey: 'term' },
        { header: 'Start Date', accessorKey: 'startDate' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item: any) => (
                <span className={`exam-status ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Schedule</Button>
                    <Button variant="ghost" size="sm">Enter Marks</Button>
                </div>
            )
        },
    ];

    return (
        <div className="exams-page animate-fade-in">
            <PageHeader
                title="Examination Management"
                description="Configure exam schedules and manage student marks entry."
                actions={
                    <Button>+ Create Exam</Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Exam Configurations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table data={mockExams} columns={examColumns} />
                </CardContent>
            </Card>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Quick Marks Entry</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Select Exam</label>
                                <select className="w-full input-field">
                                    <option>Mid-Term Examination</option>
                                    <option>Unit Test 1</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Class</label>
                                    <select className="w-full input-field"><option>Class X</option></select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Section</label>
                                    <select className="w-full input-field"><option>A</option></select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Subject</label>
                                    <select className="w-full input-field"><option>Mathematics</option></select>
                                </div>
                            </div>
                            <Button className="w-full mt-2">Proceed to Marks Entry</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary-50 border-primary-200">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-primary-900 mb-2">Generate Report Cards</h3>
                        <p className="text-sm text-primary-700 mb-6">Compile marks and generate termly or annual report cards for students.</p>
                        <Button>Go to Report Cards</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
