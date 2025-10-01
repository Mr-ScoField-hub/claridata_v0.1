import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, CheckCircle } from "lucide-react";
import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (location.state) {
            setData(location.state);
            sessionStorage.setItem("claridata-errors", JSON.stringify(location.state));
        } else {
            const stored = sessionStorage.getItem("claridata-errors");
            if (stored) {
                setData(JSON.parse(stored));
            } else {
                navigate("/");
            }
        }
    }, [location.state, navigate]);

    if (!data) return null;

    const { errors, cleanedData } = data;
    const hasErrors = errors && errors.length > 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    {hasErrors ? (
                        <XCircle size={28} className={styles.headerIcon} />
                    ) : (
                        <CheckCircle size={28} className={styles.headerIcon} style={{ color: "green" }} />
                    )}
                    <h2 className={styles.title}>
                        {hasErrors ? `Errors Found: ${errors.length}` : "Data is Clean"}
                    </h2>
                </div>
            </header>

            {hasErrors ? (
                <>
                    <p className={styles.subtitle}>We detected these problems in your uploaded data:</p>
                    <ul className={styles.errorList}>
                        {errors.map((err, i) => (
                            <li key={i} className={styles.errorItem}>
                                <XCircle size={18} className={styles.iconError} />
                                <span className={styles.message}>{err}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className={styles.subtitle} style={{ color: "green" }}>
                    Your data looks clean and ready to use!
                </p>
            )}

            <button
                className={styles.button}
                onClick={() => {
                    if (cleanedData && typeof cleanedData === "object") {
                        try {
                            const stringified = JSON.stringify(cleanedData);
                            sessionStorage.setItem("cleanedData", stringified);
                            navigate("/summary", { state: { cleanedData } });
                        } catch (err) {
                            console.error("Failed to stringify cleanedData", err);
                        }
                    } else {
                        alert("Cannot proceed — cleaned data is invalid or missing.");
                    }
                }}
                disabled={!cleanedData || (hasErrors && errors.length === 0)}
            >
                {hasErrors ? "Fix & View Summary" : "View Summary"}
            </button>
        </div>
    );
}
