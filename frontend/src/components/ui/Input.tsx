import { forwardRef, type InputHTMLAttributes } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, required, ...props }, ref) => {
        const inputClasses = ['input-field', error ? 'input-error' : '', className].filter(Boolean).join(' ');

        return (
            <div className="input-group">
                {label && (
                    <label className="input-label">
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </label>
                )}
                <input ref={ref} className={inputClasses} required={required} {...props} />
                {error && <p className="input-error-msg">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
