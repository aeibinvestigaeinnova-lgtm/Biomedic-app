import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav style={{
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      padding: "1rem 2rem",
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        
        {/* Logo / Nombre */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 style={{
            margin: 0,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold"
          }}>
            BioNavigator
          </h2>
        </Link>

        {/* Enlaces de navegación */}
        <div style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap"
        }}>
          <Link to="/" style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "500",
            transition: "color 0.2s"
          }}>
            Inicio
          </Link>
          
          <Link to="/opportunities" style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "500",
            transition: "color 0.2s"
          }}>
            Oportunidades
          </Link>
          
          <Link to="/talleres" style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "500",
            transition: "color 0.2s"
          }}>
            Talleres
          </Link>
        </div>
      </div>
    </nav>
  )
}