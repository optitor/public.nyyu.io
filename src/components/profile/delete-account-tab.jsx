import React from "react"

export default function DeleteAccountTab() {
    return (
        <div className="sign-out">
            <h4>confirm delete account</h4>
            <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                <p>Are you sure you want to delete your account?</p>
                <button className="btn-primary">delete account</button>
            </div>
        </div>
    )
}
