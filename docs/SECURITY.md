# Security Requirements and Threat Model

TransferHub handles credentials and initiates network connections to user-supplied hosts. Security is a core product requirement, not a later polish task.

## 1. Secrets

- Encrypt passwords and private keys at rest using authenticated encryption.
- Keep the encryption key outside the database and rotate it through a documented process.
- Never return secrets from connection-list or connection-detail endpoints.
- Never log credentials, private-key material, session cookies, or file contents.
- Do not store server credentials in localStorage, IndexedDB, analytics, or client error reports.
- Clear sensitive form values after successful save where practical.

## 2. SSH and TLS verification

- Verify SSH host keys and display fingerprints on first connection.
- Require an explicit trust action before saving a new host key.
- Persist known host fingerprints and alert on unexpected changes.
- Validate FTPS certificates, trust chains, and hostnames.
- Do not silently downgrade FTPS to plaintext FTP.
- Make insecure test-only modes unavailable in production builds.

## 3. SSRF and network isolation

Because the API connects to arbitrary user-provided hosts:

- Resolve hostnames and reject loopback, link-local, private, multicast, unspecified, and cloud metadata destinations unless explicitly allowed by an administrator.
- Re-check resolved addresses at connection time and defend against DNS rebinding.
- Restrict outbound network access using deployment-level egress policy where possible.
- Validate every redirect and secondary connection target.
- Apply connection timeouts, transfer timeouts, and per-user concurrency limits.
- Do not permit protocol adapters to bypass the central destination policy.

## 4. File and path safety

- Normalize paths and reject traversal outside the selected remote root.
- Treat symbolic links and server-provided names as untrusted input.
- Escape filenames before rendering them in HTML.
- Avoid following remote symlinks unless the behavior is explicitly configured.
- Apply configurable upload size limits and storage quotas.
- Consider optional malware scanning for shared/public uploads.

## 5. Web application security

- Use secure, HttpOnly, SameSite cookies for browser sessions.
- Protect state-changing requests against CSRF.
- Enforce authentication and authorization on every non-health API route.
- Apply rate limits to login, connection tests, and sensitive actions.
- Use CSP, secure headers, and strict input validation.
- Require confirmation for irreversible deletes and overwrites.

## 6. Transfer worker safety

- Use bounded buffers and backpressure.
- Support cancellation and clean up partial files.
- Redact remote error messages before returning them to clients.
- Avoid shell interpolation; never build shell commands from user inputs.
- Run workers with least privilege and an isolated filesystem.
- Record status and audit events without recording transferred content.

## 7. Deployment

- Do not expose PostgreSQL or Redis to the public internet.
- Require HTTPS in production.
- Provide non-default secrets in `.env.example` only as placeholders.
- Do not commit real `.env` files, test credentials, or private keys.
- Document backup and encryption-key recovery together.

## 8. Release checklist

- [ ] SSH host-key verification test
- [ ] FTPS certificate validation test
- [ ] SSRF blocklist and DNS-rebinding tests
- [ ] Path traversal and symlink tests
- [ ] Credential-at-rest encryption test
- [ ] Log redaction test
- [ ] Authentication and tenant-isolation tests
- [ ] Cancellation and partial-file cleanup tests
- [ ] Dependency and container vulnerability scan
