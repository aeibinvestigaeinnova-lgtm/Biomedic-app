import "../styles.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Home() {
  const [urgentOpportunities, setUrgentOpportunities] = useState([])
  const [workOpportunities, setWorkOpportunities] = useState([])
  const [loadingWork, setLoadingWork] = useState(true)

  // Cargar oportunidades urgentes (congresos, becas, etc.)
  useEffect(() => {
    const parseDate = (dateStr) => {
      if (!dateStr) return null
      const parts = dateStr.split("/")
      if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0])
      }
      return null
    }

    fetch(
      "https://opensheet.elk.sh/1-y5_r3rU3tai_X0C2Fs7xmOibqmJl3O2nKem3hPsQsc/Hoja%201"
    )
      .then((res) => res.json())
      .then((data) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const activeOpportunities = data.filter((item) => {
          const deadlineDate = parseDate(item["Fecha límite de inscripciones"])
          if (!deadlineDate) return false
          return deadlineDate >= today
        })

        const sorted = activeOpportunities.sort((a, b) => {
          const dateA = parseDate(a["Fecha límite de inscripciones"])
          const dateB = parseDate(b["Fecha límite de inscripciones"])
          return dateA - dateB
        })

        const top5 = sorted.slice(0, 5)
        setUrgentOpportunities(top5)
      })
      .catch((error) => {
        console.error("Error cargando oportunidades:", error)
      })
  }, [])

  // Cargar ofertas de trabajo (usando la misma URL que en Trabajo.js)
  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        const csvUrl =
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3scf0-WNhluCiUtpjPHF5tLL4JPDzfUD49mhatqRwhkDqqBKX0nSaulyLQcpLRO21itg1ISDtW8pe/pub?output=csv&_=" +
          Date.now()

        const response = await fetch(csvUrl)
        if (!response.ok) throw new Error("Error al cargar los datos")

        const csvText = await response.text()

        // Parsear CSV
        const lines = csvText.split("\n").filter((line) => line.trim() !== "")
        if (lines.length === 0) {
          setLoadingWork(false)
          return
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

        const parsedData = []
        for (let i = 1; i < lines.length; i++) {
          const values = []
          let inQuotes = false
          let currentValue = ""

          for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              values.push(currentValue.trim())
              currentValue = ""
            } else {
              currentValue += char
            }
          }
          values.push(currentValue.trim())

          const cleanValues = values.map((v) => v.replace(/^"|"$/g, ""))

          const row = {}
          headers.forEach((header, idx) => {
            row[header] = cleanValues[idx] || ""
          })

          parsedData.push(row)
        }

        // Tomar las primeras 3 ofertas
        const top3 = parsedData.slice(0, 3)
        setWorkOpportunities(top3)
        setLoadingWork(false)
      } catch (error) {
        console.error("Error cargando ofertas de trabajo:", error)
        setLoadingWork(false)
        // Datos de ejemplo en caso de error
        const ejemploData = [
          {
            "Nombre del trabajo": "Ingeniero Biomédico Senior",
            Empresa: "Medtronic",
            Requisitos: "Ingeniería Biomédica, 5 años de experiencia",
            Funciones: "Diseño de dispositivos médicos",
            "Tipo de Trabajo": "Tiempo completo",
            "Experiencia Requerida": "5+ años",
            Área: "Instrumentación médica",
          },
          {
            "Nombre del trabajo": "Practicante de Imágenes Médicas",
            Empresa: "Siemens Healthineers",
            Requisitos: "Estudiante de últimos ciclos",
            Funciones: "Apoyo en procesamiento de imágenes",
            "Tipo de Trabajo": "Pasantía",
            "Experiencia Requerida": "Sin experiencia",
            Área: "Imágenes y señales",
          },
          {
            "Nombre del trabajo": "Especialista en Biomateriales",
            Empresa: "Johnson & Johnson",
            Requisitos: "Maestría en Biomateriales",
            Funciones: "Investigación y desarrollo",
            "Tipo de Trabajo": "Tiempo completo",
            "Experiencia Requerida": "2+ años",
            Área: "Biomateriales y/o tejidos",
          },
        ]
        setWorkOpportunities(ejemploData)
      }
    }

    fetchWorkData()
  }, [])

  return (
    <div>
      <div className="blob1"></div>
      <div className="blob2"></div>

      {/* HERO */}
      <div className="hero">
        <h1>
          Descubre el futuro de la
          <span className="highlight"> ingeniería biomédica</span>
        </h1>
        <p>
          Encuentra congresos, becas, pasantías y cursos diseñados
          para estudiantes de ingeniería biomédica en todo el mundo.
        </p>
        <div className="buttons">
          <Link to="/opportunities">
            <button className="btn-primary">Explorar oportunidades</button>
          </Link>
          <Link to="/opportunities">
            <button className="btn-secondary">
              Encontrar oportunidades para mí
            </button>
          </Link>
          <Link to="/trabajo">
            <button
              className="btn-primary"
              style={{
                backgroundColor: "#10b981",
                marginLeft: "16px",
              }}
            >
              💼 Ofertas de trabajo
            </button>
          </Link>
        </div>
      </div>

      {/* SECCIÓN DE OPORTUNIDADES URGENTES */}
      {urgentOpportunities.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              ⏰ ¡No te lo pierdas!
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: "1.1rem",
              }}
            >
              Estas oportunidades están por vencer - ¡Aplica ahora!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {urgentOpportunities.map((opp, index) => (
              <div
                key={index}
                className="opportunity-card"
                style={{
                  border: "2px solid #f59e0b",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  🔥 ¡Últimos días!
                </div>
                <h3>{opp["Nombre de la oportunidad"]}</h3>
                <div className="tag">{opp["Tipo de evento"]}</div>
                <div className="organization">{opp["Organización"]}</div>
                <div className="info">📍 {opp["País"]}</div>
                <div className="info">💻 {opp["Modalidad"]}</div>
                <div
                  className="deadline"
                  style={{
                    color: "#f59e0b",
                    fontWeight: "bold",
                  }}
                >
                  ⏰ Cierra: {opp["Fecha límite de inscripciones"]}
                </div>
                <a href={opp["Link"]} target="_blank" rel="noopener noreferrer">
                  <button className="apply-btn">Aplicar ahora</button>
                </a>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link to="/opportunities">
              <button
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "40px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Ver todas las oportunidades →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* SECCIÓN DE OFERTAS DE TRABAJO */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            💼 Ofertas de trabajo destacadas
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            Encuentra las mejores oportunidades laborales en ingeniería biomédica
          </p>
        </div>

        {loadingWork ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            Cargando ofertas de trabajo...
          </div>
        ) : workOpportunities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No hay ofertas de trabajo disponibles en este momento.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {workOpportunities.map((trabajo, index) => (
              <div key={index} className="opportunity-card">
                <h3>{trabajo["Nombre del trabajo"] || "Sin título"}</h3>
                <div
                  className="tag"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                  }}
                >
                  {trabajo["Tipo de Trabajo"] || "No especificado"}
                </div>
                <div className="organization">
                  🏢 {trabajo["Empresa"] || "Empresa no especificada"}
                </div>
                <div className="info">
                  📋 {trabajo["Área"] || "Área no especificada"}
                </div>
                <div className="info">
                  ⭐ {trabajo["Experiencia Requerida"] || "No especificada"}
                </div>
                {trabajo["Requisitos"] && (
                  <div
                    className="deadline"
                    style={{
                      color: "#10b981",
                      marginTop: "12px",
                    }}
                  >
                    📌 Requisitos: {trabajo["Requisitos"].substring(0, 80)}...
                  </div>
                )}
                <button
                  className="apply-btn"
                  style={{
                    backgroundColor: "#10b981",
                    marginTop: "16px",
                  }}
                  onClick={() =>
                    alert(
                      `📧 Postular a: ${trabajo["Nombre del trabajo"]}\n🏢 Empresa: ${trabajo["Empresa"]}\n\nPronto recibirás instrucciones para continuar con el proceso.`
                    )
                  }
                >
                  Postular ahora
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón para ver todas las ofertas */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link to="/trabajo">
            <button
              style={{
                padding: "12px 32px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "40px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)"
                e.target.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)"
                e.target.style.boxShadow = "none"
              }}
            >
              Ver todas las ofertas de trabajo →
            </button>
          </Link>
        </div>
      </div>

      {/* CARDS - Aquí están las tres cards incluyendo TRABAJO */}
      <div className="cards">
        <Link to="/opportunities" style={{ textDecoration: "none" }}>
          <div className="card">
            <h3>🔎 Explorar oportunidades</h3>
            <p>Filtra congresos, becas y cursos según tu área biomédica.</p>
          </div>
        </Link>

        <Link to="/talleres" style={{ textDecoration: "none" }}>
          <div className="card">
            <h3>📄 Talleres</h3>
            <p>
              Descubre talleres, workshops y cursos para potenciar tus
              habilidades en ingeniería biomédica.
            </p>
          </div>
        </Link>

        <Link to="/trabajo" style={{ textDecoration: "none" }}>
          <div className="card">
            <h3>💼 Ofertas de trabajo</h3>
            <p>
              Encuentra pasantías, prácticas y empleos en el campo de la
              ingeniería biomédica.
            </p>
          </div>
        </Link>
      </div>

      {/* FOOTER - AEIB */}
      <footer
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "60px 20px 30px",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            textAlign: "center",
          }}
        >
          {/* Logo AEIB */}
          <div>
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "8px",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              AEIB
            </h2>
            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              Asociación de Estudiantes de Ingeniería Biomédica
            </p>
          </div>

          {/* Subdirección */}
          <div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "16px",
                color: "#f3f4f6",
              }}
            >
              Subdirección de Investigación e Innovación
            </h3>
            <p
              style={{
                color: "#9ca3af",
                lineHeight: "1.6",
              }}
            >
              Impulsando el futuro de la ingeniería biomédica
              <br />
              a través de la investigación y la innovación tecnológica.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "16px",
                color: "#f3f4f6",
              }}
            >
              Contáctanos
            </h3>

            {/* Instagram */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📷</span>
              <a
                href="https://instagram.com/aeib.pe"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#e4405f")}
                onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
              >
                @aeib.pe
              </a>
            </div>

            {/* Teléfono */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📞</span>
              <a
                href="tel:+51999999999"
                style={{
                  color: "#9ca3af",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#10b981")}
                onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
              >
                +51 999 999 999
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "16px",
                color: "#f3f4f6",
              }}
            >
              Enlaces rápidos
            </h3>
            <Link
              to="/trabajo"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                display: "block",
                marginBottom: "12px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#10b981")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              💼 Ofertas de trabajo
            </Link>
            <Link
              to="/opportunities"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                display: "block",
                marginBottom: "12px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#10b981")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              📅 Próximos eventos
            </Link>
            <Link
              to="/talleres"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                display: "block",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#10b981")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              📚 Talleres y cursos
            </Link>
          </div>
        </div>

        {/* Línea divisoria y derechos */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "40px auto 0",
            paddingTop: "30px",
            borderTop: "1px solid #374151",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          <p>
            © {new Date().getFullYear()} AEIB - Asociación de Estudiantes de
            Ingeniería Biomédica
            <br />
            Subdirección de Investigación e Innovación
          </p>
        </div>
      </footer>
    </div>
  )
}