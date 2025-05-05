import React from 'react';

type Column = {
    key: string;
    label: string;
};

type Props = {
    columns: Column[];
    rows: Record<string, React.ReactNode>[];
};

export default function Table({ columns, rows }: Props) {
    return (
        <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" className="px-6 py-3 font-medium">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4">
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
