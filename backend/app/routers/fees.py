from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import FeeInvoice, FeePayment, Student, User
from ..schemas import FeeInvoiceCreate, FeeInvoiceOut, FeePaymentCreate, FeePaymentOut

router = APIRouter(prefix="/fees", tags=["fees"])


@router.post("/invoices", response_model=FeeInvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: FeeInvoiceCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal", "accountant")),
):
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    invoice = FeeInvoice(**payload.model_dump())
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return FeeInvoiceOut(
        id=invoice.id,
        student_id=invoice.student_id,
        term=invoice.term,
        amount_due=invoice.amount_due,
        status=invoice.status,
    )


@router.post("/payments", response_model=FeePaymentOut, status_code=status.HTTP_201_CREATED)
def record_payment(
    payload: FeePaymentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("school_admin", "principal", "accountant")),
):
    invoice = db.query(FeeInvoice).filter(FeeInvoice.id == payload.invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if payload.amount_paid <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    if payload.payment_mode not in {"cash", "card", "upi", "bank"}:
        raise HTTPException(status_code=400, detail="Invalid payment mode")

    payment = FeePayment(**payload.model_dump())
    db.add(payment)

    total_paid = sum(p.amount_paid for p in db.query(FeePayment).filter(FeePayment.invoice_id == payload.invoice_id).all())
    total_paid += payload.amount_paid

    if total_paid >= invoice.amount_due:
        invoice.status = "paid"
    else:
        invoice.status = "partial"

    db.commit()
    db.refresh(payment)
    db.refresh(invoice)

    return FeePaymentOut(
        id=payment.id,
        invoice_id=payment.invoice_id,
        amount_paid=payment.amount_paid,
        payment_mode=payment.payment_mode,
        transaction_ref=payment.transaction_ref,
    )


@router.get("/invoices", response_model=list[FeeInvoiceOut])
def list_invoices(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(FeeInvoice).order_by(FeeInvoice.id.asc()).all()
    return [
        FeeInvoiceOut(
            id=r.id,
            student_id=r.student_id,
            term=r.term,
            amount_due=r.amount_due,
            status=r.status,
        )
        for r in rows
    ]


@router.get("/payments", response_model=list[FeePaymentOut])
def list_payments(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    rows = db.query(FeePayment).order_by(FeePayment.id.asc()).all()
    return [
        FeePaymentOut(
            id=r.id,
            invoice_id=r.invoice_id,
            amount_paid=r.amount_paid,
            payment_mode=r.payment_mode,
            transaction_ref=r.transaction_ref,
        )
        for r in rows
    ]
