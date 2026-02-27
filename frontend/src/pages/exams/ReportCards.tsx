import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Download, Printer, Eye } from 'lucide-react';
import './ReportCards.css';

// Mock Data – Class results
const mockStudents = [
    { id: '101', name: 'Aarav Sharma', class: 'Class X-A', totalMarks: '420/500', percentage: '84%', grade: 'A', rank: 3, status: 'Generated' },
    { id: '102', name: 'Diya Desai', class: 'Class X-A', totalMarks: '465/500', percentage: '93%', grade: 'A+', rank: 1, status: 'Generated' },
    { id: '103', name: 'Rohan Patel', class: 'Class X-A', totalMarks: '--/500', percentage: '--', grade: '--', rank: null, status: 'Pending Mks' },
    { id: '104', name: 'Sneha Kumar', class: 'Class X-A', totalMarks: '452/500', percentage: '90.4%', grade: 'A+', rank: 2, status: 'Generated' },
    { id: '105', name: 'Arjun Mehta', class: 'Class X-A', totalMarks: '388/500', percentage: '77.6%', grade: 'B+', rank: 4, status: 'Generated' },
];

// Mock subject-wise breakdown for preview
const mockSubjects = [
    { subject: 'Mathematics', marks: '88/100', grade: 'A' },
    { subject: 'Science', marks: '92/100', grade: 'A+' },
    { subject: 'English', marks: '78/100', grade: 'B+' },
    { subject: 'Hindi', marks: '85/100', grade: 'A' },
    { subject: 'Social Studies', marks: '77/100', grade: 'B+' },
];

// Mock published report cards history
const mockPublished = [
    { id: 'RC-2025-001', exam: 'Unit Test 1 (2025-26)', class: 'Class X-A', publishedDate: '2025-08-01', count: 42, publishedBy: 'admin@schooleye.in' },
    { id: 'RC-2024-003', exam: 'Final Exam (2024-25)', class: 'Class IX-A', publishedDate: '2025-03-20', count: 40, publishedBy: 'admin@schooleye.in' },
    { id: 'RC-2024-002', exam: 'Mid-Term (2024-25)', class: 'Class IX-A', publishedDate: '2024-10-15', count: 40, publishedBy: 'admin@schooleye.in' },
];

export const ReportCards = () => {
    const [activeTab, setActiveTab] = useState<'generate' | 'published' | 'preview'>('generate');
    const [previewStudent, setPreviewStudent] = useState<any>(null);

    const handlePreview = (student: any) => {
        if (student.status === 'Generated') {
            setPreviewStudent(student);
            setActiveTab('preview');
        }
    };

    const rcColumns = [
        { header: 'Rank', accessorKey: 'rank', cell: (item: any) => <span className="rank-badge">{item.rank ?? '--'}</span> },
        { header: 'Student Name', accessorKey: 'name' },
        { header: 'Class/Section', accessorKey: 'class' },
        { header: 'Total Marks', accessorKey: 'totalMarks' },
        { header: 'Percentage', accessorKey: 'percentage' },
        { header: 'Grade', accessorKey: 'grade', cell: (item: any) => <span className={`grade-badge grade-${item.grade?.replace('+', 'plus')}`}>{item.grade}</span> },
        {
            header: 'Status', accessorKey: 'status',
            cell: (item: any) => <span className={`rc-status ${item.status === 'Generated' ? 'generated' : 'pending'}`}>{item.status}</span>
        },
        {
            header: 'Actions', accessorKey: 'id',
            cell: (item: any) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled={item.status !== 'Generated'} onClick={() => handlePreview(item)} title="Preview"><Eye size={16} /></Button>
                    <Button variant="ghost" size="sm" disabled={item.status !== 'Generated'} title="Download PDF"><Download size={16} /></Button>
                    <Button variant="ghost" size="sm" disabled={item.status !== 'Generated'} title="Print"><Printer size={16} /></Button>
                </div>
            )
        },
    ];

    const publishedColumns = [
        { header: 'Report Card ID', accessorKey: 'id' },
        { header: 'Exam / Term', accessorKey: 'exam' },
        { header: 'Class', accessorKey: 'class' },
        { header: 'Published Date', accessorKey: 'publishedDate' },
        { header: 'Students', accessorKey: 'count' },
        { header: 'Published By', accessorKey: 'publishedBy' },
        {
            header: 'Actions', accessorKey: 'id',
            cell: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Download size={16} /> Batch PDF</Button>
                </div>
            )
        },
    ];

    return (
        <div className="report-cards-page animate-fade-in">
            <PageHeader
                title="Report Cards"
                description="Generate, preview, and publish student report cards. View past publications."
                actions={<Button variant="secondary">Export All as ZIP</Button>}
            />

            <div className="rc-tabs mb-6">
                <button className={`rc-tab ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}>Generate & Publish</button>
                <button className={`rc-tab ${activeTab === 'published' ? 'active' : ''}`} onClick={() => setActiveTab('published')}>Published History</button>
                {previewStudent && (
                    <button className={`rc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>
                        Preview: {previewStudent.name}
                    </button>
                )}
            </div>

            {activeTab === 'generate' && (
                <>
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Term / Exam</label>
                                    <select className="w-full input-field"><option>Mid-Term Examination (2025-2026)</option><option>Unit Test 1 (2025-2026)</option></select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block">Class / Section</label>
                                    <select className="w-full input-field"><option>Class X - A</option><option>Class X - B</option></select>
                                </div>
                                <Button>Load Students</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center w-full">
                                <CardTitle>Class Results Overview</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm">Calculate Ranks</Button>
                                    <Button variant="primary" size="sm">Publish All Generated</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table data={mockStudents} columns={rcColumns} />
                        </CardContent>
                        <CardFooter className="bg-neutral-50 border-t border-color justify-between text-sm text-secondary">
                            <span>Total Students: {mockStudents.length}</span>
                            <span>Generated: {mockStudents.filter(s => s.status === 'Generated').length} | Pending: {mockStudents.filter(s => s.status !== 'Generated').length}</span>
                        </CardFooter>
                    </Card>
                </>
            )}

            {activeTab === 'published' && (
                <Card>
                    <CardHeader><CardTitle>Published Report Cards Archive</CardTitle></CardHeader>
                    <CardContent>
                        <Table data={mockPublished} columns={publishedColumns} />
                    </CardContent>
                </Card>
            )}

            {activeTab === 'preview' && previewStudent && (
                <div className="rc-preview-container">
                    <Card className="rc-preview-card">
                        <CardContent className="rc-preview-content">
                            <div className="rc-preview-header">
                                <div className="rc-school-badge">SE</div>
                                <div>
                                    <h2 className="rc-school-name">SchoolEye Academy</h2>
                                    <p className="rc-exam-title">Mid-Term Examination Report Card (2025-2026)</p>
                                </div>
                            </div>

                            <div className="rc-student-info">
                                <div className="rc-info-row">
                                    <span className="rc-info-label">Student Name</span>
                                    <span className="rc-info-value">{previewStudent.name}</span>
                                </div>
                                <div className="rc-info-row">
                                    <span className="rc-info-label">Class / Section</span>
                                    <span className="rc-info-value">{previewStudent.class}</span>
                                </div>
                                <div className="rc-info-row">
                                    <span className="rc-info-label">Roll Number</span>
                                    <span className="rc-info-value">{previewStudent.id}</span>
                                </div>
                                <div className="rc-info-row">
                                    <span className="rc-info-label">Class Rank</span>
                                    <span className="rc-info-value font-bold">#{previewStudent.rank}</span>
                                </div>
                            </div>

                            <table className="rc-marks-table">
                                <thead>
                                    <tr><th>Subject</th><th>Marks Obtained</th><th>Grade</th></tr>
                                </thead>
                                <tbody>
                                    {mockSubjects.map((s, i) => (
                                        <tr key={i}><td>{s.subject}</td><td>{s.marks}</td><td><span className={`grade-badge grade-${s.grade.replace('+', 'plus')}`}>{s.grade}</span></td></tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="rc-total-row">
                                        <td><strong>Total</strong></td>
                                        <td><strong>{previewStudent.totalMarks}</strong></td>
                                        <td><strong><span className={`grade-badge grade-${previewStudent.grade.replace('+', 'plus')}`}>{previewStudent.grade}</span></strong></td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="rc-preview-footer">
                                <p>Percentage: <strong>{previewStudent.percentage}</strong> | Overall Grade: <strong>{previewStudent.grade}</strong></p>
                            </div>

                            <div className="rc-preview-actions">
                                <Button variant="secondary"><Download size={16} /> Download PDF</Button>
                                <Button variant="secondary"><Printer size={16} /> Print</Button>
                                <Button onClick={() => setActiveTab('generate')}>Back to List</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
