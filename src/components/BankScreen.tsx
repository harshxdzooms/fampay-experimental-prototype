import { Banknote } from 'lucide-react'

export function BankScreen({ onLinkBank }: { onLinkBank?: () => void }) {
  return (
    <div className="bank-screen-content">
      {/* Background Columns Architecture */}
      <div className="bank-pillars-backdrop">
        <div className="pillar" />
        <div className="pillar" />
        <div className="pillar" />
        <div className="pillar" />
      </div>

      <div className="bank-content-wrap">
        <h1 className="bank-main-title">
          Make UPI payments <br />
          with your bank!
        </h1>

        <div className="bank-unlock-divider">
          <span>◇ You will unlock ◇</span>
        </div>

        {/* 2 Feature Unlock Cards */}
        <div className="bank-features-grid">
          <div className="bank-feature-card">
            <div className="feature-card-visual">
              <div className="keychain-mockup">
                <div className="keychain-ring" />
                <div className="keychain-tag">
                  <span>YOUR.NAME</span>
                </div>
                <div className="keychain-subtag">@yesfam</div>
              </div>
            </div>
            <strong>Free</strong>
            <p>custom UPI ID</p>
          </div>

          <div className="bank-feature-card">
            <div className="feature-card-visual">
              <div className="cash-roll-mockup">
                <div className="cash-roll-cylinder">
                  <Banknote size={28} className="cash-icon" />
                  <span className="cash-band">NO LIMITS</span>
                </div>
              </div>
            </div>
            <strong>No limits.</strong>
            <p>Ever</p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="bank-action-area">
          <button className="bank-link-btn" onClick={onLinkBank}>
            Link your bank account
          </button>

          <div className="bank-or-separator">
            <span>--- Or ---</span>
          </div>

          {/* UPI Circle with sticker */}
          <div className="upi-circle-wrapper">
            <span className="no-bank-sticker">No bank<br />account?</span>
            <button className="upi-circle-btn" onClick={onLinkBank}>
              Set up UPI Circle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
