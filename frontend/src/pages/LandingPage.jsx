import React, { useState } from "react"
import { Upload, Loader2, FileText, BarChart3, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import styles from "./LandingPage.module.css"

export default function LandingPage() {
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const navigate = useNavigate()

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile || isLoading) return

        setFile(selectedFile)
        setIsLoading(true)

        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
            const res = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const text = await res.text()
                alert("Upload failed: " + text)
                setFile(null)
                setIsLoading(false)
                return
            }

            const data = await res.json()

            if (data.errors && data.errors.length > 0) {
                navigate("/errors", { state: { errors: data.errors } })
            } else {
                navigate("/summary", { state: { cleanedData: data.cleaned_data } })
            }

            setIsLoading(false)
        } catch (error) {
            alert("Upload failed: " + error)
            setFile(null)
            setIsLoading(false)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        if (!isLoading) setIsHovering(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsHovering(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsHovering(false)

        if (isLoading) return

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && droppedFile.type === "text/csv") {
            const syntheticEvent = {
                target: { files: [droppedFile] },
            }
            handleFileUpload(syntheticEvent)
        }
    }

    const uploadAreaClass = `${styles.uploadArea} ${isHovering && !isLoading ? styles.uploadAreaHover : ""
        } ${isLoading ? styles.uploadAreaDisabled : ""}`

    const iconClass = `${styles.uploadIcon} ${isLoading ? styles.uploadIconDisabled : ""
        }`

    return (
        <div className={styles.container}>
            <style>
                {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spinner {
            animation: spin 1s linear infinite;
          }
        `}
            </style>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <BarChart3 size={24} />
                        ClariData
                    </div>
                    <nav className={styles.nav}>
                        <a className={styles.navLink} href="#features">Features</a>
                        <a className={styles.navLink} href="#about">About</a>
                        <a className={styles.navLink} href="#contact">Contact</a>
                        <button className={styles.button}>Get Started</button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Clean Your CSV Data
                    <br />
                    <span style={{ color: "#2563eb" }}>Effortlessly</span>
                </h1>
                <p className={styles.subtitle}>
                    Upload your CSV files and let ClariData automatically detect errors,
                    clean inconsistencies, and prepare your data for analysis.
                </p>

                {/* Upload Section */}
                <div className={styles.uploadSection}>
                    <div
                        className={uploadAreaClass}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                            !isLoading && document.getElementById("file-input").click()
                        }
                    >
                        {isLoading && (
                            <div className={styles.loadingOverlay}>
                                <Loader2 className={`${styles.loadingSpinner} spinner`} />
                                <div className={styles.loadingText}>Processing your file...</div>
                                <div className={styles.loadingSubtext}>
                                    Analyzing and cleaning data
                                </div>
                            </div>
                        )}

                        <Upload className={iconClass} />
                        <div className={styles.uploadText}>
                            {isLoading ? "Processing..." : "Drop your CSV file here"}
                        </div>
                        <div className={styles.uploadSubtext}>
                            {isLoading ? "Please wait..." : "or click to browse and select a file"}
                        </div>

                        <input
                            id="file-input"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className={styles.hiddenInput}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className={styles.features} id="features">
                    <div className={styles.feature}>
                        <FileText className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>CSV Processing</h3>
                        <p className={styles.featureDescription}>
                            Automatically detect and handle various CSV formats and delimiters
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <Shield className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Data Validation</h3>
                        <p className={styles.featureDescription}>
                            Identify inconsistencies, missing values, and formatting issues
                        </p>
                    </div>
                    <div className={styles.feature}>
                        <BarChart3 className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Clean Output</h3>
                        <p className={styles.featureDescription}>
                            Get standardized, analysis-ready data with detailed error reports
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
