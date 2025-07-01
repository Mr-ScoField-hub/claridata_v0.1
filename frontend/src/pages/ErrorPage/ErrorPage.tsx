import { useLocation, useNavigate } from "react-router-dom"
import styles from "./ErrorPage.module.css"

export default function ErrorPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { errors, cleanedData } = location.state as { errors: string[]; cleanedData: any[] }

  return (
    <div className={styles.container}>
      <h1>🚨 Errors Found:</h1>
      <ul>
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
      <button onClick={() => navigate("/summary", { state: { cleanedData } })}>
        Fix & View Summary
      </button>
    </div>
  )
}
