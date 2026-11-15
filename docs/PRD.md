# TransferHub Product Requirements Document

- **Status:** Draft for MVP implementation
- **Product:** TransferHub
- **Category:** Browser-based file transfer and server management
- **Primary deployment:** Self-hosted Docker Compose
- **Initial audience:** Developers, DevOps engineers, agencies, IT administrators, and homelab users

## 1. Vision

TransferHub is a self-hostable, browser-first workspace for connecting to remote file systems, transferring files, and eventually administering file-transfer services. It should feel like a modern, multi-server alternative to desktop FTP clients while leaving room for storage integrations and automation.

## 2. Product modes

### 2.1 Client mode (MVP)

Connect to existing servers using FTP, FTPS, and SFTP. Browse directories, inspect file metadata, upload and download files, and manage transfers.

### 2.2 Managed-server mode (later phase)

Operate a self-hosted FTP/FTPS/SFTP service, manage users and groups, configure home directories and quotas, and inspect active sessions. Prefer a mature managed server engine such as SFTPGo over implementing server protocols from scratch.

### 2.3 Automation mode (later phase)

Schedule transfers, synchronize directories, react to file events, and move data between remote storage endpoints.

## 3. Personas and jobs to be done

| Persona | Job |
| --- | --- |
| Developer | Update and inspect files on staging or production servers |
| DevOps engineer | Transfer artifacts and keep remote directories synchronized |
| Agency | Organize and operate multiple client connections |
| Administrator | Manage accounts, permissions, quotas, and sessions |
| Homelab user | Access multiple machines and storage systems in one UI |

## 4. MVP scope

### P0: required for first usable release

- User authentication suitable for a single self-hosted deployment.
- Add, test, edit, delete, and organize saved connections.
- FTP, explicit FTPS, implicit FTPS, and SFTP connection types.
- Password and SSH private-key authentication for SFTP.
- SSH host-key fingerprint verification and persistent trust decisions.
- TLS certificate verification for FTPS.
- Remote directory listing, breadcrumbs, sorting, refresh, and file metadata.
- Upload, download, create directory, rename, and delete operations.
- Transfer queue with progress, speed, state, cancellation, retry, and history.
- Clear error states for authentication, timeouts, permissions, unsupported operations, and network failures.
- Docker Compose deployment and documented environment configuration.
- Basic unit and integration tests.

### P1: after the core client is stable

- Remote-to-remote transfer using backend streaming.
- Resume support where the server and protocol allow it.
- Folder synchronization (one-way first, two-way only after conflict handling is designed).
- WebDAV and S3-compatible storage.
- Share links with expiry, password protection, and revocation.
- Checksum verification.
- Per-connection bandwidth and concurrency limits.

### P2: platform expansion

- Managed server administration and multi-user tenancy.
- User groups, home directories, quotas, and IP policies.
- Workflow builder, scheduled tasks, event triggers, and notifications.
- SMB and additional cloud storage providers.
- CLI, Kubernetes deployment, team controls, and hosted SaaS.

## 5. Core workflows

### Connect

1. User chooses a protocol.
2. User enters host, port, username, and authentication details.
3. User selects TLS/SSH verification behavior.
4. User tests the connection.
5. User verifies an unknown SSH host fingerprint or resolves a certificate error.
6. User saves the profile and opens the remote browser.

### Transfer

1. User selects source and destination.
2. User selects one or more files.
3. The app validates capabilities and permissions.
4. The transfer enters the queue.
5. The user sees progress and can cancel or retry.
6. The app records the outcome and any verification result.

### Remote-to-remote transfer (P1)

1. User selects two saved remote connections.
2. The backend opens source and destination streams.
3. Data is piped with bounded memory and backpressure.
4. Progress is reported over WebSocket.
5. The destination is verified where checksums are available.

## 6. UX requirements

- Desktop-first, responsive layout.
- Persistent connection selector and clearly visible connection status.
- Local and remote panes with breadcrumb navigation.
- Keyboard-friendly file selection and context menus.
- Transfer drawer/panel that remains visible while browsing.
- Empty states that explain the next action.
- Destructive actions require confirmation.
- Never present mock rows or sample transfers as real server data.

## 7. Functional acceptance criteria

| ID | Acceptance criteria |
| --- | --- |
| FR-01 | User can create and securely save a connection profile |
| FR-02 | User can test FTP, FTPS, and SFTP connections |
| FR-03 | Invalid credentials return a useful, non-secret error |
| FR-04 | Unknown SSH host keys require explicit verification |
| FR-05 | User can browse directories and see file metadata |
| FR-06 | User can upload and download files |
| FR-07 | User can create, rename, and delete files/directories when permitted |
| FR-08 | Multiple transfers can be queued and monitored |
| FR-09 | Failed transfers expose retry/cancel actions and useful error details |
| FR-10 | Resume is offered only when supported by the endpoint |
| FR-11 | Connection and transfer history is available |
| FR-12 | Secrets are encrypted at rest and never returned to the browser after save |
| FR-13 | Docker Compose can run the documented local stack |
| FR-14 | User and tenant boundaries are enforced server-side |

## 8. Non-functional requirements

- Stream files with bounded memory usage.
- Apply timeouts, cancellation, and graceful shutdown.
- Keep transfer workers isolated from web request lifetimes.
- Use structured logs with secrets and file contents redacted.
- Support health checks and metrics for API and worker processes.
- Make protocol-specific capabilities visible to the UI.
- Test against controlled FTP/FTPS/SFTP fixtures before marking support complete.

## 9. Out of scope for the first week

- Hosted multi-tenant SaaS billing.
- Kubernetes management UI.
- SMB/NFS.
- Visual workflow builder.
- Full server administration suite.
- AI file operations.
- Native desktop applications.

## 10. Success measures

Initial targets (to validate, not existing claims):

- First successful connection in under two minutes.
- At least 95% successful connection tests against supported fixtures.
- At least 99% success for supported file operations in the controlled test suite.
- No credential leakage in logs, API responses, browser storage, or error traces.
- A new self-hosted installation can be started using documented Docker Compose steps.
