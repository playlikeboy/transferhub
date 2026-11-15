# TransferHub

**A universal file-transfer workspace for the browser.**

TransferHub aims to bring remote file access, secure transfers, synchronization, sharing, and transfer-server administration into one self-hostable application.

> Connect to servers. Move files with confidence. Automate the repetitive work.

## Project status

**Early scaffold.** The repository now contains product documentation, a Next.js web shell, and a Go health/status API. The connection form is currently a front-end prototype: it stores draft profiles in page memory only. Live FTP/FTPS/SFTP connectors, credential vaulting, remote browsing, and file transfers are not implemented yet.

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

## Stack

| Layer | Choice |
| --- | --- |
| Web | Next.js 16.4.6, React 19.3.1, TypeScript |
| API and transfer workers | Go 1.27.4 |
| API transport | REST + WebSocket for transfer events |
| Persistence (planned) | PostgreSQL |
| Secrets (planned) | Authenticated encryption with a deployment-managed key |
| Deployment | Docker Compose |
| Optional server engine | Evaluate SFTPGo Open Source Edition integration |

## Run locally

### Requirements

- Node.js 20.9 or newer
- npm
- Go 1.27.4

### Start the API

```bash
cd services/api
go run .
``

The API health endpoint is available at `http://localhost:8080/health`.

### Start the web app

In another terminal:

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The API is bound to localhost on port 8080 for local development.

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
docker-compose.yml     Local container orchestration
```

## Documentation

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
