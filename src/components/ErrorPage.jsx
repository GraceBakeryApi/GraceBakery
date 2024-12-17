import React from 'react'

function ErrorPage({ message }) {
    return (
        <div className="text-red-dark text-4xl">{message}</div>
    )
}

export default ErrorPage