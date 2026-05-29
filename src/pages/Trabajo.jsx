import "../styles.css"
import { useEffect, useState } from "react"

export default function Trabajo(){

  const [data, setData] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para filtros
  const [tipoTrabajo, setTipoTrabajo] = useState("")
  const [area, setArea] = useState("")
  const [experiencia, setExperiencia] = useState("")
  const [filterMode, setFilterMode] = useState("manual")
  const [userInterest, setUserInterest] = useState("")

  useEffect(() => {
    // ⚠️ IMPORTANTE: Reemplaza esta URL con el enlace de publicación que obtuviste
    // Debe verse algo así: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3scf0-WNhluCiUtpjPHF5tLL4JPDzfUD49mhatqRwhkDqqBKX0nSaulyLQcpLRO21itg1ISDtW8pe/export?format=csv&gid=0"
    fetch(csvUrl)
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar los datos")
        return res.text()
      })
      .then(csvText => {
        // Convertir CSV a array de objetos
        const lines = csvText.split("\n")
        const headers = lines[0].split(",").map(h => h.trim())
        
        const parsedData = []
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue
          
          // Manejar campos que pueden tener comas dentro
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
          
          // Limpiar comillas de los valores
          const cleanValues = values.map(v => v.replace(/^"|"$/g, ''))
          
          const row = {}
          headers.forEach((header, idx) => {
            row[header] = cleanValues[idx] || ""
          })
          
          parsedData.push(row)
        }
        
        setData(parsedData)
        setResults(parsedData)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error cargando datos:", error)
        setLoading(false)
        // Datos de ejemplo para mostrar mientras configuras
        const ejemploData = [
          {
            "Nombre del trabajo": "Ingeniero Biomédico Senior",
            "Empresa": "Medtronic",
            "Requisitos": "Ingeniería Biomédica, 5 años de experiencia",
            "Funciones": "Diseño de dispositivos médicos",
            "Tipo de Trabajo": "Tiempo completo",
            "Experiencia Requerida": "5+ años",
            "Área": "Instrumentación médica"
          },
          {
            "Nombre del trabajo": "Practicante de Imágenes Médicas",
            "Empresa": "Siemens Healthineers",
            "Requisitos": "Estudiante de últimos ciclos",
            "Funciones": "Apoyo en procesamiento de imágenes",
            "Tipo de Trabajo": "Pasantía",
            "Experiencia Requerida": "Sin experiencia",
            "Área": "Imágenes y señales"
          },
          {
            "Nombre del trabajo": "Especialista en Biomateriales",
            "Empresa": "Johnson & Johnson",
            "Requisitos": "Maestría en Biomateriales",
            "Funciones": "Investigación y desarrollo",
            "Tipo de Trabajo": "Tiempo completo",
            "Experiencia Requerida": "2+ años",
            "Área": "Biomateriales y/o tejidos"
          }
        ]
        setData(ejemploData)
        setResults(ejemploData)
      })
  }, [])

  // Filtro manual
  const applyManualFilter = () => {
    const filtered = data.filter(item =>
      (tipoTrabajo === "" || item["Tipo de Trabajo"] === tipoTrabajo) &&
      (area === "" || item["Área"] === area) &&
      (experiencia === "" || item["Experiencia Requerida"] === experiencia)
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
      const nombre = item["Nombre del trabajo"]?.toLowerCase() || ""
      const empresa = item["Empresa"]?.toLowerCase() || ""
      const requisitos = item["Requisitos"]?.toLowerCase() || ""
      const funciones = item["Funciones"]?.toLowerCase() || ""
      const tipo = item["Tipo de Trabajo"]?.toLowerCase() || ""
      const area = item["Área"]?.toLowerCase() || ""
      
      return nombre.includes(searchTerm) || 
             empresa.includes(searchTerm) || 
             requisitos.includes(searchTerm) ||
             funciones.includes(searchTerm) ||
             tipo.includes(searchTerm) ||
             area.includes(searchTerm)
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
    setTipoTrabajo("")
    setArea("")
    setExperiencia("")
    setUserInterest("")
    setResults(data)
  }

  if (loading) {
    return (
      <div className="page">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "400px",
          fontSize: "1.2rem",
          color: "#4f46e5"
        }}>
          Cargando ofertas de trabajo...
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="blob1"></div>
      <div className="blob2"></div>

      <div className="opportunities-container">
        <div className="page-header">
          <h1>
            Ofertas de
            <span className="highlight"> Trabajo</span>
          </h1>
          <p>
            Encuentra las mejores oportunidades laborales, pasantías y prácticas profesionales en ingeniería biomédica
          </p>
          {data.length === 0 && !loading && (
            <p style={{ color: "#f59e0b", marginTop: "16px" }}>
              ⚠️ No se encontraron datos. Verifica que el Google Sheet esté publicado correctamente.
            </p>
          )}
        </div>

        {/* FILTROS */}
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
                  background: filterMode === "manual" ? "#10b981" : "#f3f4f6",
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
                  background: filterMode === "recomendacion" ? "#10b981" : "#f3f4f6",
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
                    Tipo de Trabajo
                  </label>
                  <select 
                    value={tipoTrabajo} 
                    onChange={(e) => setTipoTrabajo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Todos</option>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Pasantía">Pasantía</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Práctica profesional">Práctica profesional</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    Área biomédica
                  </label>
                  <select 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)}
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
                    <option value="Ingeniería clínica">Ingeniería clínica</option>
                    <option value="Regulación y calidad">Regulación y calidad</option>
                  </select>
                </div>

                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
                    Experiencia
                  </label>
                  <select 
                    value={experiencia} 
                    onChange={(e) => setExperiencia(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px"
                    }}
                  >
                    <option value="">Todas</option>
                    <option value="Sin experiencia">Sin experiencia</option>
                    <option value="1+ años">1+ años</option>
                    <option value="2+ años">2+ años</option>
                    <option value="3+ años">3+ años</option>
                    <option value="5+ años">5+ años</option>
                  </select>
                </div>

                <button 
                  onClick={handleFilter}
                  style={{
                    padding: "10px 24px",
                    background: "#10b981",
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
                    ¿Qué tipo de trabajo buscas?
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: biomateriales, imágenes, pasantía, etc."
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
                    background: "#10b981",
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
            {(tipoTrabajo !== "" || area !== "" || experiencia !== "" || userInterest !== "") && (
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
              {data.length === 0 ? 
                "No se encontraron ofertas de trabajo. Verifica que el Google Sheet tenga datos." : 
                "No hay ofertas que coincidan con los filtros seleccionados."}
            </div>
          ) : (
            results.map((trabajo, index) => (
              <div key={index} className="opportunity-card">
                <h3>{trabajo["Nombre del trabajo"] || "Sin título"}</h3>
                <div className="tag" style={{ backgroundColor: "#10b981", color: "white" }}>
                  {trabajo["Tipo de Trabajo"] || "No especificado"}
                </div>
                <div className="organization">🏢 {trabajo["Empresa"] || "Empresa no especificada"}</div>
                <div className="info">📋 {trabajo["Área"] || "Área no especificada"}</div>
                <div className="info">⭐ {trabajo["Experiencia Requerida"] || "No especificada"}</div>
                {trabajo["Requisitos"] && (
                  <div className="deadline" style={{ color: "#10b981", marginTop: "12px" }}>
                    📌 Requisitos: {trabajo["Requisitos"].substring(0, 100)}...
                  </div>
                )}
                {trabajo["Funciones"] && (
                  <details style={{ marginTop: "12px", fontSize: "14px", color: "#4b5563" }}>
                    <summary style={{ cursor: "pointer", fontWeight: "500", color: "#4f46e5" }}>
                      Ver funciones
                    </summary>
                    <p style={{ marginTop: "8px", padding: "8px", background: "#f9fafb", borderRadius: "8px" }}>
                      {trabajo["Funciones"]}
                    </p>
                  </details>
                )}
                <button 
                  className="apply-btn" 
                  style={{ backgroundColor: "#10b981", marginTop: "16px" }}
                  onClick={() => alert(`📧 Postular a: ${trabajo["Nombre del trabajo"]}\n🏢 Empresa: ${trabajo["Empresa"]}\n\nPronto recibirás instrucciones para continuar con el proceso.`)}
                >
                  Postular ahora
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}