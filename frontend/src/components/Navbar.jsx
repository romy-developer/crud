export default function Navbar() {
  return (
    <header className="topbar">
      <a className="brand" href="#main" aria-label="PeopleDesk home">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span>PeopleDesk</span>
      </a>
      <div className="topbar-right"><span className="status-dot" /> Team workspace</div>
    </header>
  )
}
