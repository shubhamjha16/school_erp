import React from 'react';
import './Table.css';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | string;
    cell?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
}

export function Table<T>({ data, columns, isLoading, onRowClick }: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="table-loading-state">
                <div className="loader"></div>
                <p className="text-secondary mt-2">Loading data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="table-empty-state">
                <p className="text-secondary">No records found.</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={onRowClick ? 'clickable-row' : ''}
                        >
                            {columns.map((col, colIdx) => (
                                <td key={colIdx}>
                                    {col.cell
                                        ? col.cell(row)
                                        : String(row[col.accessorKey as keyof T] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
