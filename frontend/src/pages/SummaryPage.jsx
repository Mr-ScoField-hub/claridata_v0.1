import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SummaryPage.module.css";

function safeParseJSON(jsonString) {
    try {
        if (!jsonString) return null;
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

export default function SummaryPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cleanedData, setCleanedData] = useState(null);

    useEffect(() => {
        const fromState = location.state?.cleanedData;

        if (fromState) {
            setCleanedData(fromState);
        } else {
            const storedData = sessionStorage.getItem("cleanedData");
            const parsed = safeParseJSON(storedData);

            if (parsed) {
                setCleanedData(parsed);
            } else {
                setTimeout(() => {
                    navigate("/");
                }, 0);
            }
        }
    }, [location.state, navigate]);

    if (!cleanedData) {
        return <p className={styles.loading}>Loading cleaned data...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Cleaned Data Summary</h1>

            {/* Render table view */}
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        {Object.keys(cleanedData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cleanedData.map((row, idx) => (
                        <tr key={idx}>
                            {Object.values(row).map((val, i) => (
                                <td key={i}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={styles.button} onClick={() => navigate("/")}>
                ⬅️ Back to Home
            </button>
        </div>
    );
}
