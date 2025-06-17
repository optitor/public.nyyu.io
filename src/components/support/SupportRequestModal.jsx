import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import CustomSpinner from "../common/custom-spinner";
import { CloseIcon } from "../../utilities/imgImport";

const ISSUE_TYPES = [
    { value: "account", label: "Account Issues" },
    { value: "deposit", label: "Deposit Problems" },
    { value: "withdrawal", label: "Withdrawal Problems" },
    { value: "trading", label: "Trading Issues" },
    { value: "verification", label: "Identity Verification" },
    { value: "security", label: "Security Concerns" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feature", label: "Feature Request" },
    { value: "other", label: "Other" },
];

export default function SupportRequestModal({ isOpen, closeModal }) {
    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        username: user?.username || "",
        issueType: "account",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ticketId, setTicketId] = useState("");

    const resetForm = () => {
        setFormData({
            email: user?.email || "",
            username: user?.username || "",
            issueType: "account",
            subject: "",
            message: "",
        });
        setErrors({});
        setIsSuccess(false);
        setTicketId("");
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (formData.subject.length < 5) {
            newErrors.subject = "Subject must be at least 5 characters";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.length < 20) {
            newErrors.message = "Message must be at least 20 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateTicketId = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9).toUpperCase();
        return `NYYU-${timestamp}-${random}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const newTicketId = generateTicketId();
            const issueTypeLabel =
                ISSUE_TYPES.find((type) => type.value === formData.issueType)
                    ?.label || formData.issueType;
            const submissionTime = new Date().toLocaleString();

            // Web3Forms API call
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: process.env.GATSBY_WEB3FORMS_ACCESS_KEY,
                    name: formData.username,
                    email: formData.email,
                    subject: `[${newTicketId}] Support Request: ${formData.subject}`,
                    message: `
🎫 SUPPORT REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Ticket Information:
   • Ticket ID: ${newTicketId}
   • Issue Type: ${issueTypeLabel}
   • Submitted: ${submissionTime}

👤 User Information:
   • Username: ${formData.username}
   • Email: ${formData.email}

📝 Subject:
   ${formData.subject}

💬 Message:
   ${formData.message}

🔧 Technical Details:
   • User Agent: ${navigator.userAgent}
   • Current URL: ${window.location.href}
   • Submission Time: ${submissionTime}
   • Platform: Nyyu.io

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This support request was automatically generated from the Nyyu platform.
Please respond to: ${formData.email}
                    `,
                    from_name: "Nyyu Support System",
                    to: "support@nyyu.io",
                    replyto: formData.email,
                    // Additional metadata
                    "custom.ticket_id": newTicketId,
                    "custom.issue_type": issueTypeLabel,
                    "custom.username": formData.username,
                    "custom.user_agent": navigator.userAgent,
                    "custom.url": window.location.href,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log("Support request sent successfully via Web3Forms");
                setTicketId(newTicketId);
                setIsSuccess(true);

                // Reset form after 4 seconds and close modal
                setTimeout(() => {
                    setIsSuccess(false);
                    resetForm();
                    closeModal();
                }, 4000);
            } else {
                throw new Error(
                    result.message || "Failed to send support request",
                );
            }
        } catch (error) {
            console.error("Failed to send support request:", error);
            setErrors({
                submit: "Failed to send support request. Please try again or contact us directly at support@nyyu.io",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            resetForm();
            closeModal();
        }
    };

    const selectedIssueType = ISSUE_TYPES.find(
        (type) => type.value === formData.issueType,
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Support Request"
            className="modal-content-support-request"
            overlayClassName="modal-overlay"
            closeTimeoutMS={200}
        >
            <div className="modal-header">
                <h2 className="modal-title">Submit Support Request</h2>
                {!isSubmitting && (
                    <button
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <img src={CloseIcon} alt="Close" />
                    </button>
                )}
            </div>

            <div className="modal-body">
                <p className="modal-description">
                    Please fill in the form below and we will assist you with
                    your request as soon as possible.
                </p>
                {isSuccess ? (
                    <div className="success-content">
                        <Icon
                            icon="mdi:check-circle"
                            className="success-icon"
                        />
                        <h3 className="success-title">
                            Request Sent Successfully!
                        </h3>
                        <div className="ticket-id">Ticket ID: {ticketId}</div>
                        <p className="success-message">
                            Your support request has been sent to our team.
                            We'll get back to you at{" "}
                            <strong>{formData.email}</strong> as soon as
                            possible.
                        </p>
                        <p className="success-note">
                            This window will close automatically in a few
                            seconds...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label">
                                Email Address{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                placeholder="Enter your email address"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="mb-3">
                            <label className="form-label">
                                Username <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                value={formData.username}
                                onChange={(e) =>
                                    handleInputChange(
                                        "username",
                                        e.target.value,
                                    )
                                }
                                placeholder="Enter your username"
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <div className="invalid-feedback">
                                    {errors.username}
                                </div>
                            )}
                        </div>

                        {/* Issue Type Dropdown */}
                        <div className="mb-3">
                            <label className="form-label">
                                Issue Type{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select"
                                value={formData.issueType}
                                onChange={(e) =>
                                    handleInputChange(
                                        "issueType",
                                        e.target.value,
                                    )
                                }
                                disabled={isSubmitting}
                            >
                                {ISSUE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Field */}
                        <div className="mb-3">
                            <label className="form-label">
                                Subject <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                value={formData.subject}
                                onChange={(e) =>
                                    handleInputChange("subject", e.target.value)
                                }
                                placeholder="Brief description of your issue"
                                disabled={isSubmitting}
                                maxLength={200}
                            />
                            {errors.subject && (
                                <div className="invalid-feedback">
                                    {errors.subject}
                                </div>
                            )}
                            <div className="form-text">
                                {formData.subject.length}/200 characters
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="mb-3">
                            <label className="form-label">
                                Message <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className={`form-control ${errors.message ? "is-invalid" : ""}`}
                                rows="6"
                                value={formData.message}
                                onChange={(e) =>
                                    handleInputChange("message", e.target.value)
                                }
                                placeholder="Please provide detailed information about your issue..."
                                disabled={isSubmitting}
                                maxLength={2000}
                            />
                            {errors.message && (
                                <div className="invalid-feedback">
                                    {errors.message}
                                </div>
                            )}
                            <div className="form-text">
                                {formData.message.length}/2000 characters
                            </div>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="alert alert-danger" role="alert">
                                <Icon
                                    icon="mdi:alert-circle"
                                    className="me-2"
                                />
                                {errors.submit}
                            </div>
                        )}

                        {/* Note */}
                        <div className="form-footer">
                            Request will be sent to support@nyyu.io
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`btn-submit ${isSubmitting ? "loading" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "" : "SUBMIT"}
                        </button>
                    </form>
                )}
            </div>
        </Modal>
    );
}
