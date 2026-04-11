import "../styles.css"
import { useEffect, useState } from "react"

export default function Opportunities(){

  const [data, setData] = useState([])
  const [results, setResults] = useState([])
  
  // Estados para filtros
  const [tipo, setTipo] = useState("")
  const [rama, setRama] = useState("")
  const [modalidad, setModalidad] = useState("")
  const [filterMode, setFilterMode] = useState("manual")
  const [userInterest, setUserInterest] = useState("")

  // Función para convertir fechas en formato DD/MM/YYYY a objeto Date
  const parseDate = (dateStr) => {
    if (!dateStr) return null
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      // DD/MM/YYYY
      return new Date(parts[2], parts[1] - 1, parts[0])
    }
    return null
  }

  useEffect(() => {
    fetch("https://opensheet.elk.sh/1-y5_r3rU3tai_X0C2Fs7xmOibqmJl3O2nKem3hPsQsc/Hoja%201")
      .then(res => res.json())
      .then(data => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Filtrar solo oportunidades que NO han pasado
        const activeOpportunities = data.filter(item => {
          const deadlineDate = parseDate(item["Fecha límite de inscripciones"])
          if (!deadlineDate) return false
          return deadlineDate >= today
        })

        setData(activeOpportunities)
        setResults(activeOpportunities)
      })
  }, [])

  // Filtro manual
  const applyManualFilter = () => {
    const filtered = data.filter(item =>
      (tipo === "" || item["Tipo de evento"] === tipo) &&
      (rama === "" || item["Rama"] === rama) &&
      (modalidad === "" || item["Modalidad"] === modalidad)
    )
    setResults(filtered)
  }

  // Filtro por recomendación
  const applyRecommendationFilter = () => {
    if (!userInterest.trim()) {
      setResults(data)
      return
    }
    
    const searchTerm = userInterest.toLowerCase()
    const filtered = data.filter(item => {
      const rama = item["Rama"]?.toLowerCase() || ""
      const tipo = item["Tipo de evento"]?.toLowerCase() || ""
      const nombre = item["Nombre de la oportunidad"]?.toLowerCase() || ""
      const organizacion = item["Organización"]?.toLowerCase() || ""
      
      return rama.includes(searchTerm) || 
             tipo.includes(searchTerm) || 
             nombre.includes(searchTerm) ||
             organizacion.includes(searchTerm)
    })
    setResults(filtered)
  }

  const handleFilter = () => {
    if (filterMode === "manual") {
      applyManualFilter()
    } else {
      applyRecommendationFilter()
    }
  }

  const resetFilters = () => {
    setTipo("")
    setRama("")
    setModalidad("")
    setUserInterest("")
    setResults(data)
  }

  return (
    <div className="page">
      <div className="blob1"></div>
      <div className="blob2"></div>

      <div className="opportunities-container">
        <div className="page-header">
          <h1>
            Descubre nuevas
            <span className="highlight"> oportunidades</span>
          </h1>
          <p>
            Becas, pasantías, cursos y eventos para estudiantes de ingeniería biomédica
          </p>
        </div>

        {/* ===== FILTROS INTEGRADOS ===== */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center",
          marginBottom: "32px"
        }}>
          <div style={{ 
            maxWidth: "900px", 
            width: "100%",
            background: "white", 
            borderRadius: "24px", 
            padding: "24px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
          }}>
            
            {/* Selector de modo */}
            <div style={{ 
              display: "flex", 
              gap: "12px", 
              marginBottom: "24px",
              borderBottom: "1px solid #e0e0e0",
              paddingBottom: "16px"
            }}>
              <button
                onClick={() => setFilterMode("manual")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "40px",
                  border: "none",
                  background: filterMode === "manual" ? "#4f46e5" : "#f3f4f6",
                  color: filterMode === "manual" ? "white" : "#374151",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                🔍 Filtro manual
              </button>
              <button
                onClick={() => setFilterMode("recomendacion")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "40px",
                  border: "none",
                  background: filterMode === "recomendacion" ? "#4f46e5" : "#f3f4f6",
                  color: filterMode === "recomendacion" ? "white" : "#374151",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                ⭐ Recomendaciones personalizadas
              </button>
            </div>

            {/* Filtro Manual */}
            {filterMode === "manual" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    Tipo de evento
                  </label>
                  <select 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Todos</option>
                    <option value="Pasantía">Pasantía</option>
                    <option value="Curso">Curso</option>
                    <option value="Charla">Charla</option>
                    <option value="Congreso">Congreso</option>
                    <option value="Beca">Beca</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    Área biomédica
                  </label>
                  <select 
                    value={rama} 
                    onChange={(e) => setRama(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Todas</option>
                    <option value="Biomateriales y/o tejidos">Biomateriales</option>
                    <option value="Imágenes y señales">Imágenes y señales</option>
                    <option value="Instrumentación médica">Instrumentación médica</option>
                    <option value="Biomecánica">Biomecánica</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    Modalidad
                  </label>
                  <select 
                    value={modalidad} 
                    onChange={(e) => setModalidad(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Todas</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <button 
                  onClick={handleFilter}
                  style={{
                    padding: "10px 24px",
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    height: "42px"
                  }}
                >
                  Filtrar
                </button>
              </div>
            )}

            {/* Filtro de Recomendación */}
            {filterMode === "recomendacion" && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: "2", minWidth: "250px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    ¿Qué te interesa? (ej. biomateriales, imágenes, beca, etc.)
                  </label>
                  <input
                    type="text"
                    placeholder="Escribe palabras clave..."
                    value={userInterest}
                    onChange={(e) => setUserInterest(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <button 
                  onClick={handleFilter}
                  style={{
                    padding: "10px 24px",
                    background: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    height: "42px"
                  }}
                >
                  Recomendar
                </button>
              </div>
            )}

            {/* Botón reiniciar */}
            {(tipo !== "" || rama !== "" || modalidad !== "" || userInterest !== "") && (
              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button
                  onClick={resetFilters}
                  style={{
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  ✖ Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        <div className="cards">
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              No se encontraron oportunidades activas. ¡Vuelve pronto para más!
            </div>
          ) : (
            results.map((o, index) => (
              <div key={index} className="opportunity-card">
                <h3>{o["Nombre de la oportunidad"]}</h3>
                <div className="tag">{o["Tipo de evento"]}</div>
                <div className="organization">{o["Organización"]}</div>
                <div className="info">📍 {o["País"]}</div>
                <div className="info">💻 {o["Modalidad"]}</div>
                <div className="deadline">⏰ Deadline: {o["Fecha límite de inscripciones"]}</div>
                <a href={o["Link"]} target="_blank" rel="noopener noreferrer">
                  <button className="apply-btn">Aplicar</button>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}