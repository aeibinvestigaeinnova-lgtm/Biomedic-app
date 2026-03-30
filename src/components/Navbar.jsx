import { Link } from "react-router-dom"
import "../styles.css"

export default function Navbar(){

return(

<div className="navbar">

<div className="logo">
BioNavigator
</div>

<div className="menu">

<Link to="/">Inicio</Link>

<Link to="/discover">
Recomendador
</Link>

<Link to="/opportunities">
Oportunidades
</Link>

<span>CV Builder</span>

</div>

</div>

)

}