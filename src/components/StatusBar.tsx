import { BatteryMedium, Wifi } from 'lucide-react'

export function StatusBar({ time = '00:06', battery = '49%', light = false }: { time?: string; battery?: string; light?: boolean }) {
  return (
    <div className={`app-status-bar ${light ? 'status-light' : ''}`}>
      <div className="status-left">
        <span className="status-time">{time}</span>
        <span className="status-meta-dot">●</span>
      </div>
      <div className="status-right">
        <span className="status-badge-text">Vo<br />LTE</span>
        <Wifi size={14} strokeWidth={2.5} />
        <span className="status-signal-bars">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="status-battery-wrap">
          <BatteryMedium size={15} strokeWidth={2.5} />
          <span className="status-battery-pct">{battery}</span>
        </span>
      </div>
    </div>
  )
}
