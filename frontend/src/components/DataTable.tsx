
import type { RowData } from '../Pages/LandingPage'

interface Props {
    data: RowData[]
}

export default function DataTable({ data }: Props) {
    const columns = Object.keys(data[0] || {})

    return (
        <table border={1} cellPadding={5} style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col, j) => (
                            <td key={j}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
