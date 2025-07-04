import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    useEffect(() => {
        if (!state) {
            navigate("/");
        }
    }, [state, navigate]);

    if (!state) return null;

    const { errors, cleanedData } = state;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <XCircle size={28} className={styles.headerIcon} />
                    <h2 className={styles.title}>Errors Found: {errors.length}</h2>
                </div>
            </header>

            <p className={styles.subtitle}>We detected these problems in your uploaded data:</p>

            <ul className={styles.errorList}>
                {errors.map((err, i) => (
                    <li key={i} className={styles.errorItem}>
                        <XCircle size={18} className={styles.iconError} />
                        <span className={styles.message}>{err}</span>
                    </li>
                ))}
            </ul>

            <button
                className={styles.button}
                onClick={() => {
                    sessionStorage.setItem("cleanedData", JSON.stringify(cleanedData));
                    navigate("/summary", { state: { cleanedData } });
                }}
            >
                Fix & View Summary
            </button>
        </div>
    );
}
