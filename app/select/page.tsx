'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TournamentSelect() {
  const [hovered, setHovered] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Georgia', serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}/>

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Header */}
      <header style={{
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🏆</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '0.02em' }}>
            Tipovačka 2026
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>MartinK</span>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, color: 'rgba(255,255,255,0.6)', padding: '6px 14px',
              fontSize: 12, cursor: 'pointer', letterSpacing: '0.04em',
            }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', position: 'relative', zIndex: 10,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{
            color: '#3b82f6', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 16, fontFamily: "'Arial', sans-serif",
          }}>
            Select Tournament
          </p>
          <h1 style={{
            color: '#fff', fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 700, margin: '0 0 16px',
            lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            Choose your competition
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 16,
            fontFamily: "'Arial', sans-serif", fontWeight: 400,
          }}>
            Predict scores, earn points, beat your friends
          </p>
        </div>

        {/* Tournament cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24, maxWidth: 760, width: '100%',
        }}>
          {/* FIFA World Cup Card */}
          <TournamentCard
            id="wc"
            hovered={hovered}
            onHover={setHovered}
            onClick={() => router.push('/dashboard')}
            accentColor="#10b981"
            glowColor="rgba(16,185,129,0.2)"
            badge="LIVE SOON"
            badgeColor="#10b981"
            icon="⚽"
            iconBg="linear-gradient(135deg, #065f46, #10b981)"
            title="FIFA World Cup"
            subtitle="2026 · USA, Canada, Mexico"
            stats={[
              { label: 'Teams', value: '48' },
              { label: 'Matches', value: '104' },
              { label: 'Groups', value: '12' },
            ]}
            dates="11 Jun – 19 Jul 2026"
            buttonLabel="Enter Predictions →"
            buttonColor="#10b981"
          />

          {/* NHL Playoff Card */}
          <TournamentCard
            id="nhl"
            hovered={hovered}
            onHover={setHovered}
            onClick={() => router.push('/nhl')}
            accentColor="#3b82f6"
            glowColor="rgba(59,130,246,0.2)"
            badge="COMING SOON"
            badgeColor="#3b82f6"
            icon="🏒"
            iconBg="linear-gradient(135deg, #1e3a5f, #3b82f6)"
            title="NHL Playoffs"
            subtitle="2026 · Stanley Cup"
            stats={[
              { label: 'Teams', value: '16' },
              { label: 'Rounds', value: '4' },
              { label: 'Games', value: '105' },
            ]}
            dates="April – June 2026"
            buttonLabel="Coming Soon"
            buttonColor="#3b82f6"
            disabled
          />
        </div>

        {/* Bottom stats bar */}
        <div style={{
          marginTop: 64, display: 'flex', gap: 48,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 32,
        }}>
          {[
            { label: 'Active Players', value: '1' },
            { label: 'Predictions Made', value: '0' },
            { label: 'Points Awarded', value: '0' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: "'Arial', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function TournamentCard({ id, hovered, onHover, onClick, accentColor, glowColor, badge, badgeColor, icon, iconBg, title, subtitle, stats, dates, buttonLabel, buttonColor, disabled }: any) {
  const isHovered = hovered === id
  return (
    <div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      style={{
        background: isHovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isHovered ? accentColor + '44' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20, padding: 32, cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.25s ease', position: 'relative', overflow: 'hidden',
        boxShadow: isHovered ? `0 0 60px ${glowColor}` : 'none',
        opacity: disabled ? 0.7 : 1,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Glow top */}
      {isHovered && <div style={{
        position: 'absolute', top: -60, right: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>}

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: badgeColor + '22', border: `1px solid ${badgeColor}44`,
        borderRadius: 20, padding: '4px 10px', marginBottom: 24,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor }}/>
        <span style={{ color: badgeColor, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', fontFamily: "'Arial', sans-serif" }}>{badge}</span>
      </div>

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: iconBg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: 26,
          flexShrink: 0,
        }}>{icon}</div>
        <div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' }}>{title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0, fontFamily: "'Arial', sans-serif" }}>{subtitle}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        {stats.map((s: any, i: number) => (
          <div key={s.label} style={{
            flex: 1, padding: '14px 0', textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            background: 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: "'Arial', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dates */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 24, color: 'rgba(255,255,255,0.4)',
        fontSize: 13, fontFamily: "'Arial', sans-serif",
      }}>
        <span>📅</span>
        <span>{dates}</span>
      </div>

      {/* Button */}
      <button style={{
        width: '100%', padding: '14px',
        background: disabled ? 'rgba(255,255,255,0.05)' : isHovered ? buttonColor : 'rgba(255,255,255,0.06)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.08)' : buttonColor + '44'}`,
        borderRadius: 12, color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
        fontSize: 14, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease', letterSpacing: '0.02em',
        fontFamily: "'Arial', sans-serif",
      }}>
        {buttonLabel}
      </button>
    </div>
  )
}
