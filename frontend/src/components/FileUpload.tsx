import React, { useState } from 'react'
import type { RowData } from '../Pages/LandingPage'

interface Props {
    setCleanedData: React.Dispatch<React.SetStateAction<RowData[]>>
}

interface UploadResponse {
    cleanedData: RowData[]
    error?: string
}

export default function FileUpload({ setCleanedData }: Props) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file')
            return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            })

            const data: UploadResponse = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            if (data.cleanedData) {
                setCleanedData(data.cleanedData)
            } else {
                throw new Error('Unexpected response from server')
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button onClick={handleUpload} disabled={loading} style={{ marginLeft: '1rem' }}>
                {loading ? 'Processing...' : 'Upload & Clean'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
