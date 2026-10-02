export function FamBird({ size = 24, className = '', color = 'currentColor' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21.5 5.5C18.5 7 15 8.5 12 11.5L9.5 9L6 12.5C7.5 13 9 14.5 9.5 16.5C10 18.5 12 20 14 19L16 16.5C17.5 17 19.5 16 21 14.5C22 13.5 22.5 11 21.5 8.5L22 6L21.5 5.5Z"
        fill={color}
      />
      <circle cx="17.5" cy="8.5" r="1" fill="#111" />
    </svg>
  )
}

export function HomeMark({ size = 28, className = '', color = 'currentColor' }: { size?: number; className?: string; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="120 155 555 450"
      fill="none"
      stroke={color}
      strokeWidth="20"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M146 258c42-7 70 5 105-17 39-24 69-18 103 10l27 26c-31 34-73 76-103 122-19-57-22-117-132-141z" />
      <path d="M647 175c8 0 4 8 0 13l-52 63c-17 21-41 34-68 45l-126 55c-14 6-26 15-38 29 35-23 75-42 115-59l81-34c19-8 34-21 47-41-20 62-43 95-89 120L304 473l-10-21c-8-18 4-49 15-72 21-44 45-78 82-102 46-29 113-52 256-103z" />
      <path d="M310 484l74-32c9 48 26 94 59 137-49-24-96-57-133-105z" />
    </svg>
  )
}

export function RuPayLogo({ height = 14 }: { height?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 800, fontSize: `${height}px`, letterSpacing: '0.5px' }}>
      <span style={{ color: '#fff' }}>Prepaid</span>
      <span style={{ color: '#fff', fontStyle: 'italic', fontWeight: 900 }}>RuPay</span>
      <span style={{ color: '#38A169', fontStyle: 'italic', fontWeight: 900 }}>❯</span>
      <span style={{ color: '#E53E3E', fontStyle: 'italic', fontWeight: 900, marginLeft: '-4px' }}>❯</span>
    </span>
  )
}
