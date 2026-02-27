// TypeScript interfaces matching backend schemas

export interface Token {
    access_token: string;
    token_type: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserOut {
    id: number;
    email: string;
    full_name: string;
    roles: string[];
}

export interface TenantOut {
    id: number;
    name: string;
}

export interface SchoolOut {
    id: number;
    tenant_id: number;
    name: string;
    code: string;
}

export interface AcademicYearOut {
    id: number;
    school_id: number;
    name: string;
}

export interface SchoolClassOut {
    id: number;
    school_id: number;
    name: string;
}

export interface SectionOut {
    id: number;
    class_id: number;
    name: string;
}

export interface SubjectOut {
    id: number;
    class_id: number;
    name: string;
}

export interface StudentOut {
    id: number;
    admission_no: string;
    full_name: string;
    class_name: string;
    section: string;
}

export interface GuardianOut {
    id: number;
    full_name: string;
    phone: string;
    relation: string;
}

export interface AttendanceOut {
    id: number;
    student_id: number;
    date: string;
    status: string;
}

export interface NotificationOut {
    id: number;
    audience: string;
    channel: string;
    title: string;
    message: string;
}

export interface DashboardMetricsOut {
    total_students: number;
    total_guardians: number;
    total_classes: number;
    attendance_marked: number;
    notifications_sent: number;
}

export interface ExamOut {
    id: number;
    name: string;
    academic_year: string;
}

export interface StudentMarkOut {
    id: number;
    student_id: number;
    exam_id: number;
    subject: string;
    marks_obtained: number;
    max_marks: number;
}

export interface ReportCardOut {
    id: number;
    student_id: number;
    exam_id: number;
    total_obtained: number;
    total_max: number;
    percentage: string;
}

export interface FeeInvoiceOut {
    id: number;
    student_id: number;
    term: string;
    amount_due: number;
    status: string;
}

export interface FeePaymentOut {
    id: number;
    invoice_id: number;
    amount_paid: number;
    payment_mode: string;
    transaction_ref: string;
}

export interface ParentStudentSummaryOut {
    id: number;
    admission_no: string;
    full_name: string;
    class_name: string;
    section: string;
}

export interface ParentDashboardOut {
    total_students: number;
    attendance_records: number;
    report_cards: number;
    fee_invoices: number;
    fee_due_count: number;
}

export interface NotificationDispatchOut {
    id: number;
    notification_id: number;
    status: string;
}

export interface AuditLogOut {
    id: number;
    actor: string;
    action: string;
    entity: string;
    detail: string;
}
