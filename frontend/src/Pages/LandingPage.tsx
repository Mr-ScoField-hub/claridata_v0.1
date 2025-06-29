import { useState } from 'react'
import { motion, AnimatePresence, easeIn, easeOut } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import DataTable from '../components/DataTable'
import styles from './LandingPage.module.css'
import logo from '../assets/Logos/main_logo.png'
import { FaChevronDown } from 'react-icons/fa'

export interface RowData {
    [key: string]: string | number
}

const dropdownContent = {
    Products: ['Clean Data', 'Data Insights', 'AI Models', 'Data Export'],
    Solutions: ['Small Business', 'Enterprise', 'Education', 'Healthcare'],
    Resources: ['Docs', 'Tutorials', 'Community', 'Support'],
}

export default function LandingPage() {
    const [cleanedData, setCleanedData] = useState<RowData[]>([])
    const [activeDropdown, setActiveDropdown] = useState<keyof typeof dropdownContent | null>(null)

    const dropdownVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: easeOut },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: easeIn },
        },
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={logo} alt="ClariData Logo" className={styles.logo} />

                <nav className={styles.nav}>
                    {(Object.keys(dropdownContent) as Array<keyof typeof dropdownContent>).map((key) => (
                        <div
                            key={key}
                            className={styles.navItem}
                            onMouseEnter={() => setActiveDropdown(key)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <span className={styles.navText}>
                                {key}
                                <FaChevronDown
                                    className={`${styles.caret} ${activeDropdown === key ? styles.caretOpen : ''
                                        }`}
                                />
                            </span>

                            <AnimatePresence>
                                {activeDropdown === key && (
                                    <motion.div
                                        className={styles.dropdownContainer}
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {dropdownContent[key].map((item) => (
                                            <div key={item} className={styles.dropdownItem}>
                                                {item}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <button className={styles.loginButton}>Login</button>
                </nav>
            </header>

            <section className={styles.hero}>
                <h2 className={styles.heroHeading}>Upload raw CSV data,</h2>
                <p className={styles.heroSubtitle}>
                    Let AI clean it automatically, so you can focus on insights that matter.
                </p>
                <FileUpload setCleanedData={setCleanedData} />
            </section>

            {cleanedData.length > 0 && (
                <section className={styles.dataPreviewSection}>
                    <h3 className={styles.dataPreviewHeading}>Cleaned Data Preview</h3>
                    <DataTable data={cleanedData} />
                </section>
            )}
        </div>
    )
}
