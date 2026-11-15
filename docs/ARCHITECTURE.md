# TransferHub Architecture

## 1. Architectural goals

- Keep the browser unaware of protocol credentials after they are submitted.
- Centralize remote network access in backend connector workers.
- Isolate FTP/FTPS/SFTP implementations behind a capability-aware interface.
- Stream file data with bounded memory and cancellation.
- Keep the first deployment small: web, API, and database. Add a durable queue when transfer volume requires it.

## 2. High-level system

```text
Browser (Next.js)
      |
      | HTTPS / REST / WebSocket
      v
API service (Go)
  |        |          |
Auth   Connection   Transfer
       Manager      Coordinator
          |             |
          v             v
      Secret Store   Worker Pool
                         |
                  Protocol Adapters
                 /       |        \
               FTP      FTPS      SFTP
                 \       |        /
                     Remote Hosts

PostgreSQL: users, connection metadata, transfer records, audit events
Secret encryption key: deployment-managed, never stored in the same database
```

## 3. Repository components

### Web application

- Next.js App Router, React, TypeScript.
- Connection forms and connection status.
- File explorer and transfer queue UI.
- Calls the Go API; never connects directly to arbitrary FTP/SFTP hosts.
- Stores only non-sensitive UI state in the browser.

### API service

- Go HTTP server.
- Authentication, authorization, request validation, and rate limiting.
- Connection profile lifecycle.
- Capability negotiation and operation dispatch.
- Transfer job creation, cancellation, status, and event delivery.
- Audit logging with redaction.

### Protocol adapters

Define a common minimum interface for listing, stat, upload, download, mkdir, rename, remove, and close. Expose optional capabilities separately (resume, chmod, checksum, atomic rename, symlink behavior, server-side copy). A protocol adapter must not claim support for an operation it cannot safely provide.

FTP and FTPS require explicit passive-mode and data-channel handling. SFTP uses SSH and must verify host keys. FTPS must validate certificate chains and hostnames.

## 4. API shape (initial proposal)

- `GET /health` - liveness/readiness response.
- `GET /api/v1/connections` - list the current user's connection metadata (never secrets).
- `POST /api/v1/connections` - validate and save a connection profile.
- `POST /api/v1/connections/{id}/test` - test a connection.
- `GET /api/v1/connections/{id}/files?path=...` - list a directory.
- `POST /api/v1/transfers` - enqueue upload/download.
- `GET /api/v1/transfers` - list transfer jobs.
- `GET /api/v1/transfers/{id}` - inspect a transfer.
- `DELETE /api/v1/transfers/{id}` - cancel a transfer.
- `GET /api/v1/events` - WebSocket transfer events.

All endpoints require authentication except health. Use opaque IDs; never accept a client-supplied filesystem path outside the selected connection root without canonicalization and authorization checks.

## 5. Data model (MVP)

### Connection

- id
- owner_id
- name
- protocol
- host
- port
- username
- auth_type
- encrypted_secret_reference
- remote_root
- tls_mode
- known_host_fingerprint
- created_at
- updated_at

### Transfer

- id
- owner_id
- source_connection_id / destination_connection_id
- source_path / destination_path
- direction
- bytes_total / bytes_transferred
- status
- error_code / redacted_error_message
- started_at / completed_at

Do not store private keys or passwords in plaintext columns. Prefer encrypted secret payloads or a dedicated secret store; use authenticated encryption and key rotation.

## 6. Transfer lifecycle

```text
queued -> validating -> connecting -> transferring
                                |          |
                                |          +-> verifying -> completed
                                |          +-> failed
                                +-> failed
queued -> cancelled
transferring -> cancelling -> cancelled
```

Workers should use context cancellation, bounded buffers, timeouts, backpressure, and a cleanup path for partial files. Write to a temporary destination and rename atomically only when the destination server supports the required semantics.

## 7. Remote-to-remote transfer

The preferred path is backend streaming: source adapter reader -> bounded pipe -> destination adapter writer. Do not route bytes through the browser. Persist job state separately from the worker process so the UI can reconnect and inspect history.

## 8. Deployment

Docker Compose first:

- web: browser UI
- api: Go API and transfer coordinator
- postgres: metadata and job records
- optional redis: distributed queue/pub-sub when needed
- reverse proxy: HTTPS termination and secure headers

Do not publish the database or Redis ports publicly. Mount persistent volumes intentionally and document backup/restore.

## 9. Managed server integration

Evaluate SFTPGo Open Source Edition through its documented APIs instead of building protocol servers in-house. Keep this integration optional and isolated: users who only need a client should not need to run a managed server. Check the selected SFTPGo edition's current license and feature matrix before depending on a feature.
