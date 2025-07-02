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
        console.log("Location.state:", location.state);
        const fromState = location.state?.cleanedData;

        if (fromState) {
            setCleanedData(fromState);
        } else {
            const storedData = sessionStorage.getItem("cleanedData");
            console.log("Raw sessionStorage cleanedData:", storedData);
            const parsed = safeParseJSON(storedData);
            if (parsed) {
                setCleanedData(parsed);
            } else {
                navigate("/"); // no valid data, go home
            }
        }
    }, [location.state, navigate]);

    if (!cleanedData) {
        return <p className={styles.loading}>Loading cleaned data...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Cleaned Data Summary</h1>
            <pre className={styles.dataBox}>{JSON.stringify(cleanedData, null, 2)}</pre>
            <button className={styles.button} onClick={() => navigate("/")}>
                ⬅️ Back to Home
            </button>
        </div>
    );
}
