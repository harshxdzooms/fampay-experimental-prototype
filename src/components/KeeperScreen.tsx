import { CircleHelp, History, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'

export function KeeperScreen({ userName = "Harsh's Keeper" }: { userName?: string }) {
  return (
    <div className="keeper-screen-content">
      {/* Top Header */}
      <div className="keeper-header">
        <h2 className="keeper-title">{userName}</h2>
        <div className="keeper-header-actions">
          <button className="keeper-icon-btn" aria-label="Help">
            <CircleHelp size={20} />
          </button>
          <button className="keeper-icon-btn" aria-label="Keeper History">
            <History size={20} />
          </button>
        </div>
      </div>

      <p className="keeper-subtitle">
        A saving jar for your <br />
        big plans
      </p>

      {/* Glass Jar Mockup */}
      <div className="keeper-jar-container">
        <div className="mason-jar">
          <div className="jar-gold-lid">
            <div className="lid-ridges" />
          </div>
          <div className="jar-glass-body">
            <div className="jar-reflection-left" />
            <div className="jar-reflection-right" />
            <div className="jar-balance-label">
              <span className="balance-label-title">Keeper balance</span>
              <strong className="balance-label-amount">₹ 0</strong>
              <div className="label-strings">
                <i className="str-l" />
                <i className="str-r" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Rewards Pill */}
        <div className="keeper-rewards-pill">
          <span>Total Rewards</span>
          <span className="rewards-value">💵 ₹0 ❯</span>
        </div>

        <button className="keeper-update-link">
          Update on Keeper. Know more <ArrowRight size={13} />
        </button>
      </div>

      {/* Bottom Action Triptych */}
      <div className="keeper-actions-row">
        {/* Withdraw */}
        <button className="keeper-action-card">
          <div className="action-icon-circle">
            <AlertTriangle size={20} />
          </div>
          <span>Withdraw</span>
        </button>

        {/* Large Golden Save Button */}
        <div className="keeper-save-coin-wrapper">
          <button className="save-gold-coin">
            <div className="coin-inner-emboss">
              <span className="coin-slot" />
              <strong className="coin-text">Save</strong>
            </div>
          </button>
          <div className="earn-rate-sticker">
            <span>Earn upto 3%/YEAR</span>
          </div>
        </div>

        {/* Autosave */}
        <button className="keeper-action-card autosave-card">
          <span className="inactive-clip-tag">inactive</span>
          <div className="action-icon-circle">
            <RefreshCw size={20} />
          </div>
          <span>Autosave</span>
        </button>
      </div>
    </div>
  )
}
