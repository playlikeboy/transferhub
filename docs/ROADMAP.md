# TransferHub Roadmap

## One-week MVP sprint

**Target window:** 2026-12-13 to 2026-12-20  
**Definition of success:** A developer can self-host the app, save an SFTP/FTP connection, browse a remote directory, transfer files, and inspect transfer status. The sprint is successful even if lower-priority features remain explicitly out of scope.

| Day | Focus | Deliverable |
| --- | --- | --- |
| 1 | Foundation | Repository scaffold, visual shell, Docker Compose, health endpoint, local setup |
| 2 | Connection profiles | Create/edit/delete profiles, server-side validation, encrypted secret storage design |
| 3 | SFTP | SSH key/password auth, host-key verification, directory listing and metadata |
| 4 | FTP/FTPS | FTP and FTPS adapters, passive mode, TLS validation, controlled test fixtures |
| 5 | File operations | Upload/download, mkdir, rename, delete, error handling |
| 6 | Transfer manager | Queue, progress events, cancellation, retries, history |
| 7 | Hardening and release | End-to-end tests, threat-model review, Docker validation, documentation, tagged MVP |

### Sprint guardrails

- Implement a working vertical slice before polishing every screen.
- A feature is complete only when exercised against a real local test server.
- Never silently accept an unknown SSH host key or invalid TLS certificate.
- Do not put credentials in localStorage, logs, analytics, or browser-visible API responses.
- Do not promise universal resume support; advertise it only when the endpoint supports it.
- If time is short, prioritize SFTP end-to-end, then FTP/FTPS, then UI polish. Report incomplete protocols clearly.

## Phase 2: Better transfers

- Remote-to-remote backend streaming.
- Checksums and verification.
- One-way directory synchronization.
- Conflict policies and safe overwrite handling.
- Transfer bandwidth/concurrency controls.

## Phase 3: Storage and sharing

- WebDAV and S3-compatible object storage.
- Expiring and revocable file/folder links.
- Upload-only shares.
- Access history and quotas.

## Phase 4: Managed servers and automation

- Optional SFTPGo integration.
- User/group administration and quotas.
- Scheduled transfers and file watchers.
- Event-driven workflows and notifications.
- CLI and Kubernetes deployment.

## Phase 5: Collaboration and hosted service

- Team workspaces and shared connection policies.
- Centralized audit and administration.
- Hosted deployment, billing, and support only after validating demand.
