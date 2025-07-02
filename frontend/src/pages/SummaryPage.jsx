import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function SummaryPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state

    useEffect(() => {
        if (!state || !state.cleanedData || state.cleanedData.length === 0) {
            navigate("/", { replace: true })
        }
    }, [state, navigate])

    if (!state || !state.cleanedData) return null

    const { cleanedData } = state
    const columns = Object.keys(cleanedData[0])

    return (
        <div style={{ padding: "2rem" }}>
            <h1>📋 Data Summary</h1>
            <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cleanedData.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
