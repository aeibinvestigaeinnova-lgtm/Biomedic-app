import "../styles.css"
import { useEffect, useState } from "react"

export default function Opportunities(){

const [data,setData] = useState([])

useEffect(()=>{

fetch("https://opensheet.elk.sh/1-y5_r3rU3tai_X0C2Fs7xmOibqmJl3O2nKem3hPsQsc/Hoja%201")
.then(res=>res.json())
.then(data=>setData(data))

},[])

return(

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

<div className="cards">

{data.map((o,index)=>(

<div key={index} className="opportunity-card">

<h3>
{o["Nombre de la oportunidad"]}
</h3>

<div className="tag">
{o["Tipo de evento"]}
</div>

<div className="organization">
{o["Organización"]}
</div>

<div className="info">
📍 {o["País"]}
</div>

<div className="info">
💻 {o["Modalidad"]}
</div>

<div className="deadline">
⏰ Deadline: {o["Fecha límite de ir"]}
</div>

<a
href={o["Link"]}
target="_blank"
rel="noopener noreferrer"
>

<button className="apply-btn">
Aplicar
</button>

</a>

</div>

))}

</div>

</div>

</div>

)

}