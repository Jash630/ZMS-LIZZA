import { useState, useEffect } from 'react'
import { Phone, Award, Users, Shield, ArrowRight, Star, Zap } from 'lucide-react'
import { useNavigation } from '../../context/NavigationContext.jsx'

export function HeroSection() {
  const { navigateTo } = useNavigation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(150deg, #f4f7ff 0%, #ffffff 50%, #fff7f4 100%)',
    }}>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes hFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity:0; transform:translateX(20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes scrollDot {
          0%,100% { transform:translateY(0); opacity:1; }
          50%      { transform:translateY(8px); opacity:0.3; }
        }
        @keyframes dotBlink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.6); }
        }
        .h-in-up   { animation: fadeSlideUp   0.65s ease both; }
        .h-in-left { animation: fadeSlideLeft  0.65s ease both; }
        .h-in-right{ animation: fadeSlideRight 0.65s ease both; }
        .h-d1  { animation-delay: 0.10s; }
        .h-d2  { animation-delay: 0.22s; }
        .h-d3  { animation-delay: 0.34s; }
        .h-d4  { animation-delay: 0.46s; }
        .h-d5  { animation-delay: 0.58s; }
        .h-d6  { animation-delay: 0.68s; }
        .h-d7  { animation-delay: 0.80s; }
        .h-d8  { animation-delay: 0.92s; }
        .h-img { animation: fadeSlideUp 0.7s ease 0.25s both; }
        .h-float { animation: hFloat 5.5s ease-in-out infinite; }
        .h-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          cursor: pointer;
        }
        .h-btn:hover { transform: translateY(-2px) scale(1.025); }
        .h-btn-primary:hover { box-shadow: 0 14px 36px rgba(255,107,53,0.38); }
        .h-btn-outline:hover { box-shadow: 0 8px 24px rgba(255,107,53,0.18); }
        .h-badge { transition: transform 0.18s ease; }
        .h-badge:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── Background decorations ── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{
          position:'absolute', top:'-8%', right:'-4%',
          width:'55vw', height:'55vw', maxWidth:'700px', maxHeight:'700px',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(46,94,170,0.07) 0%, transparent 70%)',
          filter:'blur(60px)'
        }}/>
        <div style={{
          position:'absolute', bottom:'-5%', left:'-4%',
          width:'45vw', height:'45vw', maxWidth:'580px', maxHeight:'580px',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)',
          filter:'blur(60px)'
        }}/>
        {/* dot grid */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'radial-gradient(circle, rgba(46,94,170,0.13) 1px, transparent 1px)',
          backgroundSize:'30px 30px',
          opacity: 0.45
        }}/>
      </div>

      {/* ── Main wrapper ── */}
      <div style={{
        width:'100%', maxWidth:'1280px',
        margin:'0 auto',
        padding:'32px 40px',
        position:'relative', zIndex:1,
        display:'grid',
        gridTemplateColumns:'1fr 1fr',
        gap:'clamp(24px, 4vw, 64px)',
        alignItems:'center',
      }}>

        {/* ══════════════ LEFT ══════════════ */}
        <div style={{ display:'flex', flexDirection:'column' }}>

          {/* Tag */}
          {visible && (
            <div className="h-in-up h-d1" style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
              <span style={{
                width:'8px', height:'8px', borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg, var(--gradient-red), var(--gradient-blue))',
                animation:'dotBlink 2s ease-in-out infinite'
              }}/>
              <span style={{
                fontSize:'11px', fontWeight:700, letterSpacing:'2.5px',
                textTransform:'uppercase', color:'var(--gradient-blue)'
              }}>
                European Technology · Made for India
              </span>
            </div>
          )}

          {/* Headline */}
          {visible && (
            <h1 className="h-in-up h-d2" style={{
              fontSize:'clamp(42px, 4.8vw, 70px)',
              fontWeight:800, lineHeight:1.0,
              letterSpacing:'-1.5px',
              marginBottom:'20px',
              background:'linear-gradient(135deg, var(--gradient-red) 0%, var(--gradient-purple) 45%, var(--gradient-blue) 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
              Precision.<br/>Power.<br/>Performance.
            </h1>
          )}

          {/* Description */}
          {visible && (
            <p className="h-in-up h-d3" style={{
              fontSize:'clamp(14px, 1.25vw, 17px)',
              color:'#5a6b7c', lineHeight:1.8,
              maxWidth:'440px', marginBottom:'30px'
            }}>
              High-speed embroidery machines with European technology for sequins,
              beads &amp; coding work — built for factories that demand quality.
            </p>
          )}

          {/* Buttons */}
          {visible && (
            <div className="h-in-up h-d4" style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'32px' }}>
              <button
                onClick={() => navigateTo('contact')}
                className="h-btn h-btn-primary"
                style={{
                  backgroundColor:'var(--accent-orange)', color:'white',
                  fontWeight:700, height:'50px', fontSize:'15px',
                  padding:'0 28px', borderRadius:'10px', border:'none',
                  display:'flex', alignItems:'center', gap:'8px',
                  boxShadow:'0 6px 20px rgba(255,107,53,0.28)'
                }}
              >
                Request a Demo <ArrowRight size={17}/>
              </button>
              <a href="tel:+919876543210"
                className="h-btn h-btn-outline"
                style={{
                  border:'2px solid var(--accent-orange)',
                  color:'var(--accent-orange)', fontWeight:600,
                  height:'50px', backgroundColor:'white', fontSize:'15px',
                  padding:'0 24px', borderRadius:'10px', textDecoration:'none',
                  display:'flex', alignItems:'center', gap:'8px'
                }}
              >
                <Phone size={17}/> Call Us Now
              </a>
            </div>
          )}

          {/* Badges */}
          {visible && (
            <div className="h-in-up h-d5" style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {[
                { Icon:Award,  label:'5+ Years' },
                { Icon:Users,  label:'100+ Factories' },
                { Icon:Shield, label:'European Quality' },
              ].map(({ Icon, label }) => (
                <div key={label} className="h-badge" style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  padding:'7px 14px', borderRadius:'100px',
                  border:'1.5px solid rgba(46,94,170,0.16)',
                  backgroundColor:'rgba(46,94,170,0.05)',
                  fontSize:'12px', fontWeight:600, color:'var(--charcoal)'
                }}>
                  <Icon size={13} style={{ color:'var(--gradient-blue)' }}/>
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════ RIGHT ══════════════ */}
        <div className="h-img" style={{ position:'relative', width:'100%' }}>

          {/* soft glow behind */}
          <div style={{
            position:'absolute', inset:'-8%', borderRadius:'24px',
            background:'radial-gradient(ellipse at 60% 40%, rgba(46,94,170,0.12) 0%, rgba(255,107,53,0.06) 55%, transparent 75%)',
            filter:'blur(32px)', zIndex:0
          }}/>

          {/* Floating wrapper */}
          <div className="h-float" style={{ position:'relative', zIndex:1 }}>

            {/* ── Rectangle image 4:3 ── */}
            <div style={{
              width:'100%',
              aspectRatio:'4/3',
              borderRadius:'18px',
              overflow:'hidden',
              boxShadow:'0 20px 56px rgba(0,0,0,0.13), 0 4px 14px rgba(0,0,0,0.07)',
              position:'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1663888673897-f8bc14482f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
                alt="ZMS LIZZA Embroidery Machine"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }}
              />
              {/* bottom vignette */}
              <div style={{
                position:'absolute', bottom:0, left:0, right:0, height:'35%',
                background:'linear-gradient(to top, rgba(10,15,40,0.28) 0%, transparent 100%)'
              }}/>
            </div>

            {/* ── Card: 1200 SPM — top-left ── */}
            {visible && (
              <div className="h-in-left h-d6" style={{
                position:'absolute',
                top:'clamp(8px,4%,16px)',
                left:'clamp(-12px,-3%,-20px)',
                background:'white',
                borderRadius:'13px',
                padding:'clamp(8px,1.5%,13px) clamp(12px,2%,18px)',
                boxShadow:'0 8px 28px rgba(0,0,0,0.11)',
                borderLeft:'4px solid var(--accent-orange)',
                minWidth:'clamp(90px,11vw,128px)',
                maxWidth:'160px',
              }}>
                <p style={{
                  fontSize:'clamp(15px,2vw,21px)', fontWeight:800, margin:0,
                  background:'linear-gradient(135deg, var(--gradient-red), var(--gradient-purple))',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
                }}>1200 SPM</p>
                <p style={{ fontSize:'clamp(9px,0.85vw,11px)', color:'#999', margin:0, fontWeight:600, marginTop:'2px' }}>Max Speed</p>
              </div>
            )}

            {/* ── Card: Stars + Warranty — bottom-left ── */}
            {visible && (
              <div className="h-in-left h-d7" style={{
                position:'absolute',
                bottom:'clamp(8px,4%,18px)',
                left:'clamp(-12px,-3%,-20px)',
                background:'white',
                borderRadius:'13px',
                padding:'clamp(8px,1.5%,13px) clamp(12px,2%,18px)',
                boxShadow:'0 8px 28px rgba(0,0,0,0.11)',
                borderLeft:'4px solid #10B981',
                minWidth:'clamp(90px,11vw,120px)',
                maxWidth:'160px',
              }}>
                <div style={{ display:'flex', gap:'3px', marginBottom:'4px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={9} fill="#FBBF24" stroke="#FBBF24"/>)}
                </div>
                <p style={{ fontSize:'clamp(13px,1.6vw,17px)', fontWeight:800, margin:0, color:'#10B981' }}>2-Yr Warranty</p>
                <p style={{ fontSize:'clamp(9px,0.85vw,11px)', color:'#999', margin:0, fontWeight:500, marginTop:'2px' }}>Included Free</p>
              </div>
            )}

            {/* ── Card: 8 Sequins — bottom-right ── */}
            {visible && (
              <div className="h-in-right h-d7" style={{
                position:'absolute',
                bottom:'clamp(8px,4%,18px)',
                right:'clamp(-12px,-3%,-20px)',
                background:'white',
                borderRadius:'13px',
                padding:'clamp(8px,1.5%,13px) clamp(12px,2%,18px)',
                boxShadow:'0 8px 28px rgba(0,0,0,0.11)',
                borderLeft:'4px solid var(--gradient-blue)',
                minWidth:'clamp(90px,11vw,128px)',
                maxWidth:'160px',
              }}>
                <p style={{
                  fontSize:'clamp(15px,2vw,21px)', fontWeight:800, margin:0,
                  background:'linear-gradient(135deg, var(--gradient-purple), var(--gradient-blue))',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
                }}>8 Sequins</p>
                <p style={{ fontSize:'clamp(9px,0.85vw,11px)', color:'#999', margin:0, fontWeight:600, marginTop:'2px' }}>Multi-Function</p>
              </div>
            )}

            {/* ── Card: European Tech — middle-right (desktop only) ── */}
            {visible && (
              <div className="h-in-right h-d8" style={{
                position:'absolute',
                top:'50%', right:'clamp(-12px,-3%,-20px)',
                transform:'translateY(-50%)',
                background:'white',
                borderRadius:'13px',
                padding:'clamp(8px,1.5%,12px) clamp(12px,2%,16px)',
                boxShadow:'0 8px 28px rgba(0,0,0,0.11)',
                borderLeft:'4px solid var(--gradient-purple)',
                minWidth:'clamp(90px,11vw,128px)',
                maxWidth:'155px',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'4px', marginBottom:'4px' }}>
                  <Zap size={11} style={{ color:'var(--gradient-purple)' }}/>
                  <span style={{ fontSize:'9px', color:'var(--gradient-purple)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px' }}>Premium</span>
                </div>
                <p style={{
                  fontSize:'clamp(11px,1.3vw,15px)', fontWeight:800, margin:0,
                  background:'linear-gradient(135deg, var(--gradient-purple), var(--gradient-blue))',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
                }}>European Tech</p>
                <p style={{ fontSize:'clamp(9px,0.85vw,11px)', color:'#999', margin:0, fontWeight:500, marginTop:'2px' }}>German Engineering</p>
              </div>
            )}

          </div>{/* end h-float */}
        </div>{/* end RIGHT */}

      </div>{/* end grid */}

      {/* ── Scroll indicator ── */}
      <div style={{
        position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'5px',
        opacity:0.3, pointerEvents:'none'
      }}>
        <div style={{
          width:'22px', height:'36px', borderRadius:'11px',
          border:'2px solid #555', position:'relative'
        }}>
          <div style={{
            position:'absolute', top:'5px', left:'50%', transform:'translateX(-50%)',
            width:'3px', height:'8px', borderRadius:'2px', background:'#555',
            animation:'scrollDot 1.6s ease-in-out infinite'
          }}/>
        </div>
        <span style={{ fontSize:'9px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#555', fontWeight:700 }}>Scroll</span>
      </div>

    </section>
  )
}