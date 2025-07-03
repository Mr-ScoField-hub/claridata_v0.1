import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Loader2, FileText, BarChart3, Shield, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import styles from "./LandingPage.module.css"
import Logo from "../assets/Logo/main_logo.png"

export default function LandingPage() {
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const navigate = useNavigate()

    // Animated words for header
    const animatedWords = [
        { text: "Effortlessly", color: "#1578fa" },
        { text: "Fast", color: "#e63946" },
        { text: "Easy", color: "#2d6a4f" },
        { text: "Smart", color: "#f4a261" },
    ]
    const [wordIndex, setWordIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % animatedWords.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/csv",
        "", // sometimes empty string
    ]

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files?.[0]

        if (!selectedFile || isLoading || !allowedTypes.includes(selectedFile.type)) {
            alert("Please select a valid CSV file")
            return
        }

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
                alert(`Upload failed: ${text}`)
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
        } catch (error) {
            alert(`Upload failed: ${error.message}`)
        } finally {
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
        const isCsv =
            droppedFile &&
            (allowedTypes.includes(droppedFile.type) ||
                droppedFile.name.toLowerCase().endsWith(".csv"))

        if (isCsv) {
            handleFileUpload({ target: { files: [droppedFile] } })
        } else {
            alert("Please drop a valid CSV file")
        }
    }

    const uploadAreaClass = `${styles.uploadArea} ${isHovering && !isLoading ? styles.uploadAreaHover : ""
        } ${isLoading ? styles.uploadAreaDisabled : ""}`

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Data Analyst",
            quote: "ClariData saved me hours of manual data cleaning. It's a game-changer!",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Business Intelligence Lead",
            quote: "The error detection is incredibly accurate and the output is analysis-ready.",
            rating: 4,
        },
        {
            name: "Emily Rodriguez",
            role: "Data Scientist",
            quote: "Intuitive interface and powerful cleaning capabilities. Highly recommend!",
            rating: 5,
        },
    ]

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <motion.div
                    className={styles.headerContent}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.logo}>
                        <img src={Logo} alt="ClariData Logo" className={styles.logoImage} width={55} height={50} />
                    </div>
                    <nav className={styles.nav}>
                        <a className={styles.navLink} href="#features">
                            Features
                        </a>
                        <a className={styles.navLink} href="#testimonials">
                            Testimonials
                        </a>
                        <a className={styles.navLink} href="#contact">
                            Contact
                        </a>
                    </nav>
                    <button className={styles.button}>Get Started</button>
                </motion.div>
            </header>

            {/* Hero Section */}
            <main className={styles.main}>
                <motion.section
                    className={styles.hero}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>
                            Clean Your CSV Data
                            <br />
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={animatedWords[wordIndex].text}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ color: animatedWords[wordIndex].color }}
                                    className={styles.accentText}
                                >
                                    {animatedWords[wordIndex].text}
                                </motion.span>
                            </AnimatePresence>
                        </h1>

                        {/* Upload Section */}
                        <motion.div
                            className={styles.uploadSection}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div
                                className={uploadAreaClass}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isLoading && document.getElementById("file-input").click()}
                                role="button"
                                tabIndex={0}
                                aria-label="Upload CSV file"
                            >
                                <AnimatePresence>
                                    {isLoading && (
                                        <motion.div
                                            className={styles.loadingOverlay}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Loader2 className={`${styles.loadingSpinner} ${styles.spinner}`} />
                                            <div className={styles.loadingText}>Processing your file...</div>
                                            <div className={styles.loadingSubtext}>Analyzing and cleaning data</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Upload className={styles.uploadIcon} />
                                <div className={styles.uploadText}>{isLoading ? "Processing..." : "Drop your CSV file here"}</div>
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
                                    aria-label="CSV file input"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Insights Section */}
                <section className={styles.insights}>
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        See your business grow with clear data insights
                    </motion.h2>

                    <motion.p
                        className={styles.sectionSubtext}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        Example: <strong>+R 3 830 Revenue increase this month</strong> just by cleaning and validating existing customer data. 🔥
                    </motion.p>
                </section>

                {/* Features Section */}
                <section className={styles.features} id="features">
                    {[
                        {
                            Icon: FileText,
                            title: "CSV Processing",
                            description: "Automatically detect and handle various CSV formats and delimiters",
                        },
                        {
                            Icon: Shield,
                            title: "Data Validation",
                            description: "Identify inconsistencies, missing values, and formatting issues",
                        },
                        {
                            Icon: BarChart3,
                            title: "Clean Output",
                            description: "Get standardized, analysis-ready data with detailed error reports",
                        },
                    ].map(({ Icon, title, description }, index) => (
                        <motion.div
                            key={title}
                            className={styles.feature}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Icon className={styles.featureIcon} />
                            <h3 className={styles.featureTitle}>{title}</h3>
                            <p className={styles.featureDescription}>{description}</p>
                        </motion.div>
                    ))}
                </section>

                {/* Testimonials Section */}
                <section className={styles.testimonials} id="testimonials">
                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        What Our Users Say
                    </motion.h2>

                    <div className={styles.testimonialGrid}>
                        {testimonials.map(({ name, role, quote, rating }, index) => (
                            <motion.div
                                key={name}
                                className={styles.testimonialCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className={styles.testimonialRating}>
                                    {Array.from({ length: rating }).map((_, i) => (
                                        <Star key={i} className={styles.starIcon} fill="#facc15" />
                                    ))}
                                </div>
                                <p className={styles.testimonialQuote}>"{quote}"</p>
                                <div className={styles.testimonialAuthor}>
                                    <span className={styles.testimonialName}>{name}</span>
                                    <span className={styles.testimonialRole}>{role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={styles.footer} id="contact">
                <motion.div
                    className={styles.footerContent}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.footerSection}>
                        <img src={Logo} alt="ClariData Logo" className={styles.footerLogo} width={32} height={32} />
                        <p className={styles.footerDescription}>
                            ClariData: Your solution for effortless CSV data cleaning and preparation.
                        </p>
                    </div>
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Quick Links</h4>
                        <a className={styles.footerLink} href="#features">
                            Features
                        </a>
                        <a className={styles.footerLink} href="#testimonials">
                            Testimonials
                        </a>
                        <a className={styles.footerLink} href="#contact">
                            Contact
                        </a>
                    </div>
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Contact Us</h4>
                        <p className={styles.footerContact}>Email: support@claridata.com</p>
                        <p className={styles.footerContact}>Phone: +1 (555) 123-4567</p>
                    </div>
                </motion.div>
                <div className={styles.footerBottom}>
                    <p>&copy; {new Date().getFullYear()} ClariData. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
