# Epic: File Storage

## US_30 — File Upload and Storage

- **Story:** As the system, I want to store uploaded photos and generated visualizations in durable storage so file persistence is reliable and scalable.
- **Acceptance Criteria (AC):**
  - [ ] All user-uploaded files (room photos, furniture photos) are uploaded to storage through backend.
  - [ ] All generated visualizations (output images) are stored in storage.
  - [ ] Files are organized in a logical folder structure (e.g., `{userId}/{projectId}/{visualizationId}/{iterationId}/`).
  - [ ] File access is controlled (signed URLs or backend proxy) — files are NOT publicly accessible without authorization.
  - [ ] MVP does not include automatic retention/deletion policy for old files (out of scope).
  - [ ] Deleting project (US_14) or account (US_05) removes related files from storage.
- **Priority:** Must
