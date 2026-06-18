import "../styles.css"
import { useEffect, useState } from "react"

export default function Trabajo() {
  const [data, setData] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [headersDetected, setHeadersDetected] = useState([])

  // Estados para filtros
  const [tipoTrabajo, setTipoTrabajo] = useState("")
  const [area, setArea] = useState("")
  const [experiencia, setExperiencia] = useState("")
  const [filterMode, setFilterMode] = useState("manual")
  const [userInterest, setUserInterest] = useState("")

  // ⚠️ REEMPLAZA CON TU URL DE PUBLICACIÓN (termina en /pub?output=csv)
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3scf0-WNhluCiUtpjPHF5tLL4JPDzfUD49mhatqRwhkDqqBKX0nSaulyLQcpLRO21itg1ISDtW8pe/pub?output=csv"

  // Parser CSV robusto
  const parseCSV = (csvText) => {
    if (csvText.charCodeAt(0) === 0xfeff) {
      csvText = csvText.slice(1)
    }
    csvText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    const lines = csvText.split("\n")
    if (lines.length === 0) return []

    const firstLine = lines[0]
    let separator = ","
    if (firstLine.includes(";") && !firstLine.includes(",")) {
      separator = ";"
    } else if (firstLine.includes(";") && firstLine.includes(",")) {
      const countComma = (firstLine.match(/,/g) || []).length
      const countSemicolon = (firstLine.match(/;/g) || []).length
      separator = countSemicolon > countComma ? ";" : ","
    }

    const splitLine = (line) => {
      const values = []
      let current = ""
      let insideQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          insideQuotes = !insideQuotes
        } else if (char === separator && !insideQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())
      return values.map(v => v.replace(/^"|"$/g, "").trim())
    }

    const rawHeaders = splitLine(lines[0])
    const headers = rawHeaders.map(h => h.replace(/\s+/g, " ").trim())
    console.log("🔍 Encabezados detectados:", headers)
    setHeadersDetected(headers)

    const expectedColumns = [
      "Nombre del trabajo",
      "Empresa",
      "Requisitos",
      "Funciones",
      "Tipo de Trabajo",
      "Experiencia Requerida",
      "Área",
      "Fecha de Publicación",
      "Link",
      "¿Aún reclutando?"
    ]

    const headerMatch = expectedColumns.every(col =>
      headers.some(h => h.toLowerCase() === col.toLowerCase())
    )
    if (!headerMatch) {
      console.warn("⚠️ Los encabezados no coinciden exactamente con los esperados.")
      console.warn("Esperados:", expectedColumns)
      console.warn("Detectados:", headers)
    }

    const result = []
    let i = 1
    while (i < lines.length) {
      const line = lines[i]
      if (line.trim() === "") { i++; continue }
      let fullLine = line
      let nextLine = lines[i + 1]
      let values = splitLine(fullLine)
      while (values.length < headers.length && nextLine !== undefined) {
        fullLine += "\n" + nextLine
        values = splitLine(fullLine)
        i++
        nextLine = lines[i + 1]
      }
      while (values.length < headers.length) {
        values.push("")
      }
      const row = {}
      headers.forEach((header, idx) => {
        let key = header
        const matchedCol = expectedColumns.find(
          col => col.toLowerCase() === header.toLowerCase()
        )
        if (matchedCol) {
          key = matchedCol
        }
        row[key] = values[idx] || ""
      })
      result.push(row)
      i++
    }
    return result
  }

  const fetchData = async () => {
    setRefreshing(true)
    try {
      const urlWithCache = `${CSV_URL}&_=${Date.now()}`
      const response = await fetch(urlWithCache)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const csvText = await response.text()
      console.log("📄 CSV recibido (primeros 300 chars):", csvText.substring(0, 300))
      const parsed = parseCSV(csvText)
      console.log("📊 Datos parseados (primeros 2 registros):", parsed.slice(0, 2))
      setData(parsed)
      setResults(parsed)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (error) {
      console.error("❌ Error cargando datos:", error)
      if (data.length === 0) {
        const ejemploData = [
          {
            "Nombre del trabajo": "Ingeniero Biomédico Senior",
            Empresa: "Medtronic",
            Requisitos: "Ingeniería Biomédica, 5 años de experiencia",
            Funciones: "Diseño de dispositivos médicos",
            "Tipo de Trabajo": "Tiempo completo",
            "Experiencia Requerida": "5+ años",
            Área: "Instrumentación médica",
            "Fecha de Publicación": "2026-06-01",
            Link: "https://medtronic.com/careers",
            "¿Aún reclutando?": "Sí"
          },
          // ... más ejemplos
        ]
        setData(ejemploData)
        setResults(ejemploData)
        setLastUpdated(new Date())
      }
      setLoading(false)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filtros (sin cambios)
  const applyManualFilter = () => {
    const filtered = data.filter(
      (item) =>
        (tipoTrabajo === "" || item["Tipo de Trabajo"] === tipoTrabajo) &&
        (area === "" || item["Área"] === area) &&
        (experiencia === "" || item["Experiencia Requerida"] === experiencia)
    )
    setResults(filtered)
  }

  const applyRecommendationFilter = () => {
    if (!userInterest.trim()) {
      setResults(data)
      return
    }
    const searchTerm = userInterest.toLowerCase()
    const filtered = data.filter((item) => {
      const allText = Object.values(item).join(" ").toLowerCase()
      return allText.includes(searchTerm)
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px", fontSize: "1.2rem", color: "#4f46e5" }}>
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
          <p>Encuentra las mejores oportunidades laborales, pasantías y prácticas profesionales en ingeniería biomédica</p>

          {headersDetected.length > 0 && (
            <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "8px", backgroundColor: "#f3f4f6", padding: "8px 16px", borderRadius: "8px" }}>
              📋 Encabezados detectados: {headersDetected.join(" • ")}
            </div>
          )}

          {lastUpdated && (
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "8px" }}>
              📅 Última actualización: {lastUpdated.toLocaleString()}
            </p>
          )}
          <button
            onClick={fetchData}
            disabled={refreshing}
            style={{
              marginTop: "12px",
              padding: "8px 20px",
              background: refreshing ? "#9ca3af" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "40px",
              fontWeight: "500",
              cursor: refreshing ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {refreshing ? "🔄 Actualizando..." : "🔄 Refrescar ofertas"}
          </button>
        </div>

        {/* Filtros - sin cambios */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ maxWidth: "900px", width: "100%", background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}>
              <button onClick={() => setFilterMode("manual")} style={{ padding: "10px 20px", borderRadius: "40px", border: "none", background: filterMode === "manual" ? "#10b981" : "#f3f4f6", color: filterMode === "manual" ? "white" : "#374151", fontWeight: "500", cursor: "pointer" }}>
                🔍 Filtro manual
              </button>
              <button onClick={() => setFilterMode("recomendacion")} style={{ padding: "10px 20px", borderRadius: "40px", border: "none", background: filterMode === "recomendacion" ? "#10b981" : "#f3f4f6", color: filterMode === "recomendacion" ? "white" : "#374151", fontWeight: "500", cursor: "pointer" }}>
                ⭐ Recomendaciones personalizadas
              </button>
            </div>

            {filterMode === "manual" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>Tipo de Trabajo</label>
                  <select value={tipoTrabajo} onChange={(e) => setTipoTrabajo(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px" }}>
                    <option value="">Todos</option>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Pasantía">Pasantía</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Práctica profesional">Práctica profesional</option>
                  </select>
                </div>
                <div style={{ flex: "1", minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>Área biomédica</label>
                  <select value={area} onChange={(e) => setArea(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px" }}>
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
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>Experiencia</label>
                  <select value={experiencia} onChange={(e) => setExperiencia(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px" }}>
                    <option value="">Todas</option>
                    <option value="Sin experiencia">Sin experiencia</option>
                    <option value="1+ años">1+ años</option>
                    <option value="2+ años">2+ años</option>
                    <option value="3+ años">3+ años</option>
                    <option value="5+ años">5+ años</option>
                  </select>
                </div>
                <button onClick={handleFilter} style={{ padding: "10px 24px", background: "#10b981", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", height: "42px" }}>
                  Filtrar
                </button>
              </div>
            )}

            {filterMode === "recomendacion" && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: "2", minWidth: "250px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>¿Qué tipo de trabajo buscas?</label>
                  <input type="text" placeholder="Ej: biomateriales, imágenes, pasantía..." value={userInterest} onChange={(e) => setUserInterest(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px" }} />
                </div>
                <button onClick={handleFilter} style={{ padding: "10px 24px", background: "#10b981", color: "white", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", height: "42px" }}>
                  Recomendar
                </button>
              </div>
            )}

            {(tipoTrabajo !== "" || area !== "" || experiencia !== "" || userInterest !== "") && (
              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button onClick={resetFilters} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d1d5db", borderRadius: "8px", color: "#6b7280", cursor: "pointer", fontSize: "13px" }}>
                  ✖ Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tarjetas con botón de postulación que abre el enlace */}
        <div className="cards">
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              {data.length === 0 ? "No se encontraron ofertas de trabajo. Verifica que el Google Sheet tenga datos." : "No hay ofertas que coincidan con los filtros."}
            </div>
          ) : (
            results.map((trabajo, index) => {
              // Verificar si el enlace existe y es válido
              const link = trabajo["Link"] || ""
              const isLinkValid = link && (link.startsWith("http://") || link.startsWith("https://"))
              const isRecruiting = trabajo["¿Aún reclutando?"]?.toLowerCase() === "sí" || trabajo["¿Aún reclutando?"]?.toLowerCase() === "true"

              return (
                <div key={index} className="opportunity-card">
                  <h3>{trabajo["Nombre del trabajo"] || "Sin título"}</h3>
                  <div className="tag" style={{ backgroundColor: "#10b981", color: "white" }}>
                    {trabajo["Tipo de Trabajo"] || "No especificado"}
                  </div>
                  <div className="organization">🏢 {trabajo["Empresa"] || "Empresa no especificada"}</div>
                  <div className="info">📋 {trabajo["Área"] || "Área no especificada"}</div>
                  <div className="info">⭐ {trabajo["Experiencia Requerida"] || "No especificada"}</div>
                  {trabajo["Fecha de Publicación"] && (
                    <div className="info">📅 {trabajo["Fecha de Publicación"]}</div>
                  )}
                  {trabajo["¿Aún reclutando?"] && (
                    <div className="info">
                      {isRecruiting ? "✅ Aún reclutando" : "❌ No reclutando"}
                    </div>
                  )}
                  {trabajo["Requisitos"] && (
                    <div className="deadline" style={{ color: "#10b981", marginTop: "12px" }}>
                      📌 Requisitos: {trabajo["Requisitos"].substring(0, 100)}...
                    </div>
                  )}
                  {trabajo["Funciones"] && (
                    <details style={{ marginTop: "12px", fontSize: "14px", color: "#4b5563" }}>
                      <summary style={{ cursor: "pointer", fontWeight: "500", color: "#4f46e5" }}>Ver funciones</summary>
                      <p style={{ marginTop: "8px", padding: "8px", background: "#f9fafb", borderRadius: "8px" }}>{trabajo["Funciones"]}</p>
                    </details>
                  )}
                  <button
                    className="apply-btn"
                    style={{
                      backgroundColor: isLinkValid ? "#10b981" : "#9ca3af",
                      marginTop: "16px",
                      cursor: isLinkValid ? "pointer" : "not-allowed",
                      opacity: isLinkValid ? 1 : 0.6,
                    }}
                    onClick={() => {
                      if (isLinkValid) {
                        window.open(link, "_blank", "noopener,noreferrer")
                      } else {
                        alert("⚠️ Esta oferta no tiene un enlace de postulación disponible.")
                      }
                    }}
                    disabled={!isLinkValid}
                  >
                    {isLinkValid ? "📎 Postular ahora" : "🔗 Sin enlace"}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}