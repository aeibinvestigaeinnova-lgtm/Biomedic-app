import "../styles.css"
import { Link } from "react-router-dom"

export default function Home(){

return(

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
<button className="btn-primary">
Explorar oportunidades
</button>
</Link>

<Link to="/discover">
<button className="btn-secondary">
Encontrar oportunidades para mí
</button>
</Link>

</div>

</div>


{/* CARDS */}

<div className="cards">

<Link to="/opportunities" style={{textDecoration:"none"}}>

<div className="card">
<h3>🔎 Explorar oportunidades</h3>
<p>
Filtra congresos, becas y cursos según tu área biomédica.
</p>
</div>

</Link>


<Link to="/discover" style={{textDecoration:"none"}}>

<div className="card">
<h3>🧠 Recomendador inteligente</h3>
<p>
La plataforma sugiere oportunidades según tu perfil.
</p>
</div>

</Link>


<div className="card">
<h3>📄 Construye tu CV</h3>
<p>
Genera un CV académico optimizado para becas e investigación.
</p>
</div>

</div>

</div>

)

}