import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SummaryPage.module.css";

export default function SummaryPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cleanedData, setCleanedData] = useState(null);
    const [fullData, setFullData] = useState(null);

    useEffect(() => {
        const stateData = location.state?.cleanedData;

        if (stateData) {
            setCleanedData(stateData.slice(0, 5));
            setFullData(stateData);
        } else {
            try {
                const stored = sessionStorage.getItem("cleanedData");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setCleanedData(parsed.slice(0, 5));
                    setFullData(parsed);
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.error("Failed to parse cleanedData:", err);
                navigate("/");
            }
        }
    }, [navigate, location.state]);

    const downloadCSV = () => {
        if (!fullData) return;
        const headers = ["Order ID", "Order Date", "Product Name", "Sales", "Quantity", "Profit"];
        const rows = fullData.map(row => [
            row["Order ID"],
            row["Order Date"],
            row["Product Name"],
            Number(row["Sales"]).toFixed(2),
            row["Quantity"],
            Number(row["Profit"]).toFixed(2)
        ]);
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "sales_summary.csv");
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!cleanedData) return null;

    return (
        <div className={styles.pageWrapper}>
            <section className={styles.headerSection}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <div className={styles.iconWrapper}>
                            <svg className={styles.icon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 3h18v4H3zM7 7v13m10-13v13" />
                            </svg>
                        </div>
                        <div>
                            <h1 className={styles.title}>Sales Summary</h1>
                            <p className={styles.subtitle}>Overview of recent cleaned data</p>
                        </div>
                    </div>
                    <button className={styles.downloadButton} onClick={downloadCSV}>
                        <svg className={styles.downloadIcon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Download CSV
                    </button>
                </div>
            </section>

            <section className={styles.tableSection}>
                <div className={`${styles.tableWrapper} ${styles.fadeInUp}`}>
                    <div className={styles.tableOverflow}>
                        <table className={styles.table}>
                            <thead className={styles.thead}>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Date</th>
                                    <th>Product Name</th>
                                    <th>Sales</th>
                                    <th>Quantity</th>
                                    <th>Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cleanedData.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row["Order ID"]}</td>
                                        <td>{row["Order Date"]}</td>
                                        <td>{row["Product Name"]}</td>
                                        <td>${Number(row["Sales"]).toFixed(2)}</td>
                                        <td>{row["Quantity"]}</td>
                                        <td className={Number(row["Profit"]) < 0 ? styles.red : styles.green}>
                                            R{Number(row["Profit"]).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className={styles.footerInfo}>Showing up to 5 most recent records.</p>
            </section>
        </div>
    );
}
