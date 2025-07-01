import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./LandingPage.module.css"

export default function LandingPage() {
    const [file, setFile] = useState<File | null>(null)
    const navigate = useNavigate()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        setFile(selectedFile)

        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
            const res = await fetch("http://localhost:8000/upload-csv", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (data.error) {
                alert("Upload Error: " + data.error)
                setFile(null)
                return
            }

            if (data.errors.length > 0) {
                navigate("/errors", { state: { errors: data.errors, cleanedData: data.cleaned_data } })
            } else {
                navigate("/summary", { state: { cleanedData: data.cleaned_data } })
            }
        } catch (error) {
            alert("Upload failed: " + error)
            setFile(null)
        }
    }

    return (
        <div className={styles.container}>
            <h1>📊 ClariData CSV Uploader</h1>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={!!file}
                className={styles.upload}
            />
        </div>
    )
}
