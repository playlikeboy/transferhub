"use client";

import { useEffect, useState, type FormEvent } from "react";

type Protocol = "SFTP" | "FTPS" | "FTP";

type ConnectionDraft = {
  id: string;
  name: string;
  protocol: Protocol;
  host: string;
  port: number;
  username: string;
};

type ApiState = "checking" | "online" | "offline";

const protocolPorts: Record<Protocol, number> = {
  SFTP: 22,
  FTPS: 21,
  FTP: 21,
};

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connections, setConnections] = useState<ConnectionDraft[]>([]);
  const [apiState, setApiState] = useState<ApiState>("checking");

  useEffect(() => {
    let active = true;

    fetch("/api/health", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("API health check failed");
        return response.json();
      })
      .then(() => {
        if (active) setApiState("online");
      })
      .catch(() => {
        if (active) setApiState("offline");
      });

    return () => {
      active = false;
    };
  }, []);

  function addConnection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const protocol = String(form.get("protocol")) as Protocol;
    const portValue = Number(form.get("port"));

    const profile: ConnectionDraft = {
      id: crypto.randomUUID(),
      name: String(form.get("name")).trim(),
      protocol,
      host: String(form.get("host")).trim(),
      port: Number.isFinite(portValue) && portValue > 0 ? portValue : protocolPorts[protocol],
      username: String(form.get("username")).trim(),
    };

    setConnections((current) => [profile, ...current]);
    setDialogOpen(false);
    event.currentTarget.reset();
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="TransferHub home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>transfer<span className="brand-light">hub</span></span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">P</span>
          <span className="workspace-copy">
            <strong>Personal workspace</strong>
            <small>Self-hosted edition</small>
          </span>
          <span className="chevron">⌄</span>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><span className="nav-icon">◫</span>Overview</a>
          <a className="nav-item" href="#connections"><span className="nav-icon">⌘</span>Connections<span className="nav-count">{connections.length}</span></a>
          <a className="nav-item" href="#transfers"><span className="nav-icon">⇄</span>Transfers<span className="nav-count">0</span></a>
          <a className="nav-item" href="#automation"><span className="nav-icon">◷</span>Automation<span className="soon-tag">SOON</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">✳</span>
            <strong>Built for your workflow</strong>
            <p>One workspace for every remote file system.</p>
            <a href="https://github.com/playlikeboy/transferhub" target="_blank" rel="noreferrer">View project ↗</a>
          </div>
          <a className="nav-item muted" href="#settings"><span className="nav-icon">⚙</span>Settings</a>
          <div className="user-row">
            <span className="user-avatar">S</span>
            <span><strong>Local workspace</strong><small>Development mode</small></span>
            <span className="more">···</span>
          </div>
        </div>
      </aside>

      <section className="main-area" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>Overview</strong></div>
          <div className="top-actions">
            <span className={`api-indicator ${apiState}`}><i />API {apiState}</span>
            <a className="icon-button" href="https://github.com/playlikeboy/transferhub" target="_blank" rel="noreferrer" aria-label="GitHub repository">↗</a>
            <button className="primary-button compact" onClick={() => setDialogOpen(true)}>＋ New connection</button>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR FILE TRANSFER WORKSPACE</div>
              <h1>Move files. <span>Stay in flow.</span></h1>
              <p className="subtitle">Connect to your servers and manage every transfer from one place.</p>
            </div>
            <div className="date-pill"><span className="pulse" /> Local development preview</div>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top"><span>Saved connections</span><span className="stat-icon">⌘</span></div>
              <div className="stat-value">{connections.length.toString().padStart(2, "0")}</div>
              <div className="stat-foot">Profiles in this page session</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Active transfers</span><span className="stat-icon">⇄</span></div>
              <div className="stat-value">00</div>
              <div className="stat-foot">Nothing running right now</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Data transferred</span><span className="stat-icon">↗</span></div>
              <div className="stat-value">—</div>
              <div className="stat-foot">Available when transfers are connected</div>
            </article>
          </div>

          <div className="content-grid">
            <section className="panel connections-panel" id="connections">
              <div className="panel-heading">
                <div>
                  <div className="eyebrow">YOUR SERVERS</div>
                  <h2>Connections</h2>
                </div>
                <button className="text-button" onClick={() => setDialogOpen(true)}>＋ Add connection</button>
              </div>

              {connections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-art" aria-hidden="true">
                    <div className="art-window">
                      <div className="art-window-bar"><i /><i /><i /></div>
                      <div className="art-lines"><i /><i /><i /></div>
                      <span className="art-arrow">↗</span>
                    </div>
                    <span className="art-orbit orbit-one" />
                    <span className="art-orbit orbit-two" />
                  </div>
                  <h3>Your workspace is ready</h3>
                  <p>Add your first server to start building your transfer workspace. Your connections will appear here.</p>
                  <button className="primary-button" onClick={() => setDialogOpen(true)}>＋ Add your first connection</button>
                  <div className="supported">Supports <b>SFTP</b><span>·</span><b>FTPS</b><span>·</span><b>FTP</b></div>
                </div>
              ) : (
                <div className="connection-list">
                  {connections.map((connection) => (
                    <article className="connection-row" key={connection.id}>
                      <div className="protocol-tile">{connection.protocol.slice(0, 1)}</div>
                      <div className="connection-info">
                        <strong>{connection.name}</strong>
                        <span>{connection.username}@{connection.host}:{connection.port}</span>
                      </div>
                      <span className="draft-status">Draft profile</span>
                      <span className="connection-more">···</span>
                    </article>
                  ))}
                  <p className="prototype-note">These are temporary UI drafts only. Live connection testing and encrypted persistence are not wired up yet.</p>
                </div>
              )}
            </section>

            <aside className="right-column">
              <section className="panel quick-panel">
                <div className="eyebrow">GETTING STARTED</div>
                <h2>Ready for your first transfer?</h2>
                <p>Connect a server, choose a folder, and move files securely.</p>
                <div className="quick-steps">
                  <div><span>01</span><p><b>Add a connection</b><small>Choose FTP, FTPS or SFTP.</small></p></div>
                  <div><span>02</span><p><b>Browse remote files</b><small>Explore folders and file details.</small></p></div>
                  <div><span>03</span><p><b>Start transferring</b><small>Track progress in one queue.</small></p></div>
                </div>
                <div className="quick-footer"><span>Designed for self-hosting</span><span>↗</span></div>
              </section>
              <section className="panel roadmap-panel" id="automation">
                <div className="roadmap-top"><span className="eyebrow">ON THE ROADMAP</span><span className="roadmap-spark">✳</span></div>
                <h3>More than an FTP client.</h3>
                <p>Remote-to-remote transfers, folder sync, sharing and scheduled workflows are planned after the core client.</p>
                <a href="https://github.com/playlikeboy/transferhub/blob/main/docs/ROADMAP.md" target="_blank" rel="noreferrer">Explore the roadmap ↗</a>
              </section>
            </aside>
          </div>

          <section className="panel activity-panel" id="transfers">
            <div className="panel-heading">
              <div><div className="eyebrow">LIVE OPERATIONS</div><h2>Transfer activity</h2></div>
              <span className="quiet-label">No active jobs</span>
            </div>
            <div className="activity-empty"><span className="activity-symbol">⇄</span><span>Your transfer queue is clear. Active uploads and downloads will show up here.</span></div>
          </section>

          <footer className="page-footer"><span>TransferHub <b>·</b> Early development</span><span>Secure by design. Self-hosted by default.</span></footer>
        </div>
      </section>

      {dialogOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <section className="connection-modal" role="dialog" aria-modal="true" aria-labelledby="connection-title">
            <div className="modal-heading">
              <div><div className="eyebrow">NEW SERVER</div><h2 id="connection-title">Add a connection</h2></div>
              <button className="close-button" onClick={() => setDialogOpen(false)} aria-label="Close dialog">×</button>
            </div>
            <p className="modal-description">Create a connection profile. Live protocol connections and encrypted credential storage are the next implementation step.</p>
            <form onSubmit={addConnection}>
              <label>Connection name<input name="name" placeholder="Production server" required maxLength={48} /></label>
              <div className="form-grid">
                <label>Protocol
                  <select name="protocol" defaultValue="SFTP" onChange={(event) => {
                    const portInput = document.querySelector<HTMLInputElement>('input[name="port"]');
                    if (portInput) portInput.value = String(protocolPorts[event.target.value as Protocol]);
                  }}>
                    <option value="SFTP">SFTP</option><option value="FTPS">FTPS</option><option value="FTP">FTP</option>
                  </select>
                </label>
                <label>Port<input name="port" type="number" min="1" max="65535" defaultValue="22" required /></label>
              </div>
              <label>Host<input name="host" placeholder="server.example.com" required maxLength={253} /></label>
              <label>Username<input name="username" placeholder="deploy" required maxLength={128} /></label>
              <div className="prototype-warning"><span>i</span><p>Prototype only: this creates an in-memory draft. Do not enter passwords or private keys here yet.</p></div>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setDialogOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">Save draft profile</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
