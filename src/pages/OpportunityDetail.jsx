import { useParams } from "react-router-dom"

export default function OpportunityDetail(){

const {id} = useParams()

return(

<div style={{padding:"120px 40px",maxWidth:"800px",margin:"auto"}}>

<h1>Detalle de oportunidad</h1>

<p>ID de oportunidad: {id}</p>

<p style={{marginTop:"20px"}}>
Aquí aparecerá la información completa:
</p>

<ul style={{marginTop:"20px"}}>
<li>Descripción</li>
<li>Requisitos</li>
<li>Deadline</li>
<li>Link de aplicación</li>
</ul>

<button style={{marginTop:"30px"}}>
Aplicar
</button>

</div>

)
}