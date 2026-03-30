import "../styles.css"
import { useState, useEffect } from "react"
import Papa from "papaparse"

export default function Discover(){

const [data,setData] = useState([])
const [results,setResults] = useState([])

const [tipo,setTipo] = useState("")
const [rama,setRama] = useState("")
const [modalidad,setModalidad] = useState("")

const sheetURL =
"https://docs.google.com/spreadsheets/d/1-y5_r3rU3tai_X0C2Fs7xmOibqmJl3O2nKem3hPsQsc/export?format=csv"


useEffect(()=>{

Papa.parse(sheetURL,{
download:true,
header:true,
complete:(res)=>{

// limpiar filas vacías
const clean = res.data.filter(
r => r["Nombre de la oportunidad"]
)

setData(clean)
setResults(clean)

}
})

},[])



function filter(){

const filtered = data.filter(item =>

(tipo === "" || item["Tipo de evento"] === tipo) &&
(rama === "" || item["Rama"] === rama) &&
(modalidad === "" || item["Modalidad"] === modalidad)

)

setResults(filtered)

}



return(

<div className="page">

<div className="blob1"></div>
<div className="blob2"></div>

<div className="discover-wrapper">

<div className="discover-header">

<h1>
Encuentra oportunidades
<span className="highlight"> para ti</span>
</h1>

<p>
Filtra oportunidades biomédicas según tu interés.
</p>

</div>


<div className="discover-card">

<div className="form-group">

<label>Tipo de evento</label>

<select onChange={(e)=>setTipo(e.target.value)}>

<option value="">Todos</option>
<option value="Pasantía">Pasantía</option>
<option value="Curso">Curso</option>
<option value="Charla">Charla</option>

</select>

</div>


<div className="form-group">

<label>Área biomédica</label>

<select onChange={(e)=>setRama(e.target.value)}>

<option value="">Todas</option>
<option value="Biomateriales y/o tejidos">Biomateriales</option>
<option value="Imágenes y señales">Imágenes y señales</option>
<option value="Todas">Todas</option>

</select>

</div>


<div className="form-group">

<label>Modalidad</label>

<select onChange={(e)=>setModalidad(e.target.value)}>

<option value="">Todas</option>
<option value="Presencial">Presencial</option>
<option value="Virtual">Virtual</option>

</select>

</div>


<button className="discover-btn" onClick={filter}>
Filtrar oportunidades
</button>

</div>



{/* RESULTADOS */}

<div className="cards">

{results.map((item,i)=>(

<div key={i} className="opportunity-card">

<h3>{item["Nombre de la oportunidad"]}</h3>

<p className="organization">
{item["Organización"]}
</p>

<span className="tag">
{item["Tipo de evento"]}
</span>

<p className="info">
📍 {item["País"]}
</p>

<p className="deadline">
⏳ {item["Fecha limite de ir"]}
</p>

<a href={item["Link"]} target="_blank" rel="noreferrer">

<button className="apply-btn">
Ver oportunidad
</button>

</a>

</div>

))}

</div>


</div>

</div>

)

}