import { useState } from 'react'

/**
 * Renders a static CSS fallback for the 3D phone model.
 * Displays the same real app screenshot while the 3D scene warms up or when WebGL is unavailable.
 *
 * @param {Object} props
 * @param {string} [props.screenImageSrc] - Path to the screenshot image displayed on the phone screen.
 * @returns {JSX.Element} The rendered phone fallback component.
 */
export default function PhoneFallback({
  screenImageSrc = '/images/expify/screen-1.png',
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showScreenshot = Boolean(screenImageSrc) && failedSrc !== screenImageSrc

  return (
    <div className="phone-fallback" aria-hidden="true">
      <div className="phone-fallback-frame">
        <div className="phone-fallback-screen">
          <span className="phone-fallback-island" />

          {showScreenshot ? (
            <img
              src={screenImageSrc}
              alt=""
              className="phone-fallback-screenshot"
              decoding="async"
              onError={() => setFailedSrc(screenImageSrc)}
            />
          ) : (
            <div className="project-screen">
              <div className="screen-status">
                <span>9:41</span>
                <span>● ● ▰</span>
              </div>

              <div className="screen-brand">
                mrh<span>.rafi</span>
              </div>

              <p className="screen-greeting">Flutter App Developer</p>
              <h2>Rafi 👋</h2>
              <p className="screen-subtitle">Building thoughtful mobile apps.</p>

              <div className="screen-search">⌕ &nbsp; Flutter · Dart · C++ · DSA</div>

              <div className="screen-filters">
                <span className="active">Projects</span>
                <span>Flutter</span>
                <span>DSA</span>
              </div>

              <div className="task-card">
                <div className="task-icon green">◷</div>
                <div>
                  <strong>Clocky Mobile App</strong>
                  <small>Clock · Alarm · Stopwatch</small>
                </div>
              </div>

              <div className="task-card">
                <div className="task-icon yellow">◈</div>
                <div>
                  <strong>Expify Beta</strong>
                  <small>Flutter · Expense Tracker</small>
                </div>
              </div>

              <div className="task-card">
                <div className="task-icon blue">⌘</div>
                <div>
                  <strong>Flutter &amp; Dart UI</strong>
                  <small>Clean Mobile Architecture</small>
                </div>
              </div>

              <div className="task-card">
                <div className="task-icon pink">✳</div>
                <div>
                  <strong>C++ &amp; DSA Foundations</strong>
                  <small>Problem Solving &amp; Logic</small>
                </div>
              </div>

              <div className="screen-bottom">
                <span>⌂<small>Home</small></span>
                <span>▦<small>Apps</small></span>
                <span>▥<small>Skills</small></span>
                <span>⚙<small>Contact</small></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
