import { Ticket } from 'lucide-react'

export function RewardsScreen() {
  return (
    <div className="rewards-screen-content">
      {/* Top Counters */}
      <div className="rewards-counters-row">
        <div className="counter-pill coin-pill">
          <span className="counter-coin-icon">🪙</span>
          <span className="counter-val">0</span>
        </div>

        <div className="counter-pill cash-pill">
          <span className="counter-cash-icon">💵</span>
          <span className="counter-val">₹0</span>
        </div>

        <div className="counter-pill ticket-pill">
          <Ticket size={16} className="ticket-icon" />
          <span className="counter-val">1</span>
        </div>
      </div>

      {/* Insider Section */}
      <section className="rewards-insider-section">
        <div className="insider-title-wrap">
          <h2 className="insider-brand">insider</h2>
          <span className="insider-subtitle">Insane deals, for the Fam!</span>
        </div>

        {/* Ticket Banner: Adobe Express */}
        <div className="insider-ticket-card">
          <div className="ticket-notch left" />
          <div className="ticket-notch right" />
          <div className="ticket-content">
            <span className="ticket-category">Adobe Express Premium</span>
            <h3 className="ticket-heading">
              Create stunning posts, videos &amp; more for <br />
              <del>₹4000</del> <mark className="free-badge">FREE!</mark>
            </h3>
          </div>
          <div className="ticket-visual">
            <div className="ticket-phone-preview">
              <span className="heart-bubble">❤️</span>
              <span className="heart-bubble bottom">❤️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Edition Section */}
      <section className="limited-edition-section">
        <div className="limited-edition-heading">
          <span className="limited-text">limited</span>
          <span className="edition-text">EDITION</span>
        </div>

        <div className="limited-cards-grid">
          {/* Zoomin Card */}
          <div className="deal-card">
            <div className="deal-card-image-box zoomin-box">
              <div className="mug-art">☕</div>
            </div>
            <div className="deal-card-brand zoomin-brand">zoomin</div>
            <div className="deal-card-desc">
              Customised Photo Mug <br />
              for just <del>₹399</del> <strong>₹149</strong>
            </div>
          </div>

          {/* Purna Card */}
          <div className="deal-card">
            <div className="deal-card-image-box purna-box">
              <div className="massage-art">⚡</div>
            </div>
            <div className="deal-card-brand purna-brand">purna</div>
            <div className="deal-card-desc">
              Portable Massage Gun <br />
              at just <del>₹1199</del> <strong>₹399</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
