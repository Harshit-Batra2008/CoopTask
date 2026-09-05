// Maps the backend's VerificationStatus enum values to a StatusBadge
// tone. Kept in one place so worker-facing and admin-facing screens
// always agree on what each status looks like.

export function verificationBadge(status) {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", tone: "success" };
    case "REJECTED":
      return { label: "Rejected", tone: "danger" };
    case "PENDING":
    default:
      return { label: "Pending review", tone: "pending" };
  }
}
