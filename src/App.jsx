import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Opportunities from "./pages/Opportunities"
import OpportunityDetail from "./pages/OpportunityDetail"
import Talleres from "./pages/Talleres"
import Trabajo from "./pages/Trabajo"  // ← IMPORTACIÓN AGREGADA

function App(){

return(

<>

<Navbar/>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/opportunities" element={<Opportunities />} />

<Route path="/opportunity/:id" element={<OpportunityDetail />} />

<Route path="/talleres" element={<Talleres />} />

<Route path="/trabajo" element={<Trabajo />} />  {/* ← RUTA AGREGADA */}

</Routes>

</>

)

}

export default App