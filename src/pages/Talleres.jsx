import "../styles.css"

export default function Talleres() {

  return (
    <div className="page">
      <div className="blob1"></div>
      <div className="blob2"></div>

      <div style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          
          {/* Ojos animados */}
          <div style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            marginBottom: "40px"
          }}>
            {/* Ojo izquierdo */}
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#1f2937",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "blink 4s infinite"
              }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  position: "relative",
                  top: "-4px",
                  left: "4px"
                }}></div>
              </div>
            </div>

            {/* Ojo derecho */}
            <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#1f2937",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "blink 4s infinite 0.2s"
              }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  position: "relative",
                  top: "-4px",
                  left: "4px"
                }}></div>
              </div>
            </div>
          </div>

          {/* Texto principal */}
          <h1 style={{
            fontSize: "3rem",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🚧 ¡Se vienen cositas! 🚧
          </h1>

          <p style={{
            fontSize: "1.2rem",
            color: "#6b7280",
            marginBottom: "24px",
            lineHeight: "1.6"
          }}>
            Estamos trabajando en contenido increíble para ti.<br />
            Pronto encontrarás talleres, workshops y cursos aquí.
          </p>

          {/* Decoración */}
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "32px"
          }}>
            <span style={{
              fontSize: "2rem",
              animation: "wave 1s infinite"
            }}>🔨</span>
            <span style={{
              fontSize: "2rem",
              animation: "wave 1s infinite 0.2s"
            }}>⚡</span>
            <span style={{
              fontSize: "2rem",
              animation: "wave 1s infinite 0.4s"
            }}>🎨</span>
          </div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes blink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.1);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}