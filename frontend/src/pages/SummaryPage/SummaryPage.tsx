import { useLocation } from "react-router-dom"
import styles from "./SummaryPage.module.css"

export default function SummaryPage() {
    const location = useLocation()
    const { cleanedData } = location.state as { cleanedData: any[] }

    const handleDownload = () => {
        const csv = [
            Object.keys(cleanedData[0]).join(","),
            ...cleanedData.map((row) => Object.values(row).join(",")),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "cleaned_data.csv"
        link.click()
    }

    return (
        <div className={styles.container}>
            <h1>📈 Cleaned Data Summary</h1>
            <p><strong>Records:</strong> {cleanedData.length}</p>
            <button onClick={handleDownload}>Download Cleaned CSV</button>
        </div>
    )
}
