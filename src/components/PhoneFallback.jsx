// Static CSS phone. It is shown while the 3D model downloads, and stays as
// the permanent picture if WebGL is missing or the 3D scene fails.
// The TaskFlow screen is a DEMO UI, not a published app.
export default function PhoneFallback() {
  return (
    <div className="phone-fallback" aria-hidden="true">
      <div className="phone-fallback-frame">
        <div className="phone-fallback-screen">
          <span className="phone-fallback-island" />

          <div className="project-screen">
            <div className="screen-status">
              <span>9:41</span>
              <span>● ● ▰</span>
            </div>

            <div className="screen-brand">
              Task<span>Flow</span>
            </div>

            <p className="screen-greeting">Good morning,</p>
            <h2>Rafi 👋</h2>
            <p className="screen-subtitle">Let’s make today productive!</p>

            <div className="screen-search">⌕ &nbsp; Search tasks...</div>

            <div className="screen-filters">
              <span className="active">All</span>
              <span>Today</span>
              <span>Upcoming</span>
            </div>

            <div className="task-card">
              <div className="task-icon green">✓</div>
              <div>
                <strong>Design home screen</strong>
                <small>Design · 10:00 AM</small>
              </div>
            </div>

            <div className="task-card">
              <div className="task-icon blue">⌘</div>
              <div>
                <strong>Develop API integration</strong>
                <small>Development · 2:00 PM</small>
              </div>
            </div>

            <div className="task-card">
              <div className="task-icon pink">✳</div>
              <div>
                <strong>Test and fix bugs</strong>
                <small>Testing · 4:00 PM</small>
              </div>
            </div>

            <div className="task-card">
              <div className="task-icon yellow">▤</div>
              <div>
                <strong>Prepare presentation</strong>
                <small>Work · 6:00 PM</small>
              </div>
            </div>

            <div className="screen-bottom">
              <span>⌂<small>Home</small></span>
              <span>▦<small>Calendar</small></span>
              <span>▥<small>Stats</small></span>
              <span>⚙<small>Settings</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
