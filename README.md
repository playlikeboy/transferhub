# TransferHub

**A universal file-transfer workspace for the browser.**

TransferHub aims to bring remote file access, secure transfers, synchronization, sharing, and transfer-server administration into one self-hostable application.

> Connect to servers. Move files with confidence. Automate the repetitive work.

## Project status

**Early development.** This repository currently contains the product definition and architecture plan. The first application scaffold is being added separately. FTP/FTPS/SFTP connections, remote browsing, and file transfers are planned MVP capabilities, not yet implemented.

## Product goals

- Connect to existing FTP, explicit/implicit FTPS, and SFTP servers.
- Manage local and remote files through a clear dual-pane browser interface.
- Queue, monitor, retry, and inspect transfers.
- Move data between remote endpoints without unnecessary browser round-trips.
- Offer an optional managed-server mode for users who want to host file-transfer services.
- Add WebDAV, S3-compatible storage, sharing, and automation after the core client is reliable.

## First-week MVP

The first one-week build sprint targets a **usable end-to-end MVP**, not every feature in the long-term vision:

1. Next.js/TypeScript browser workspace and connection form.
2. Go API service with connection profiles and health checks.
3. FTP/FTPS/SFTP connector foundation with secure credential handling.
4. Remote directory listing and basic file metadata.
5. Upload/download flow with a visible transfer queue.
6. Docker Compose deployment and environment documentation.
7. Basic integration tests, security checks, and a deployment walkthrough.

A capability is only considered complete when it works end-to-end against a real test server. UI-only placeholders must be labelled as such.

## Planned stack

| Layer | Choice |
| --- | --- |
| Web | Next.js 16, React, TypeScript |
| API and transfer workers | Go 1.27 |
| API transport | REST + WebSocket for transfer events |
| Persistence | PostgreSQL (connection metadata and users) |
| Secrets | Authenticated encryption using a deployment-managed key |
| Deployment | Docker Compose first |
| Optional server engine | Evaluate SFTPGo Open Source Edition integration |

Framework/runtime versions are starting baselines and should be updated through reviewed dependency changes.

## Repository layout

```text
apps/
  web/                 Next.js browser application
services/
  api/                 Go API and protocol orchestration
docs/
  PRD.md               Product requirements and priorities
  ARCHITECTURE.md      System boundaries and technical design
  ROADMAP.md           One-week MVP sprint and later phases
  SECURITY.md          Threat model and security requirements
```

## Development

The application scaffold and local development instructions will be added in the first implementation commit. Do not put real server passwords, SSH private keys, API tokens, or production data in this repository.

## Product documentation

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Security](docs/SECURITY.md)

## Design principles

1. **Browser-first:** no desktop installation required for the primary workflow.
2. **Protocol-aware:** capabilities and limitations are explicit per server.
3. **Secure by default:** verify SSH host keys and TLS certificates; never silently downgrade security.
4. **Streaming:** large files move through bounded streams, not whole-file memory buffers.
5. **Honest status:** show what is implemented, unsupported, queued, failed, or still running.
6. **Self-hostable:** one-command local/VPS deployment is a first-class use case.

## License

The project license is intentionally not selected yet. Choose and add a license before inviting external contributions or distributing releases. Review all third-party dependency and integration licenses before adoption.
