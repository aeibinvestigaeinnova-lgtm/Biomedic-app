import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Discover from "./pages/Discover"
import Opportunities from "./pages/Opportunities"
import OpportunityDetail from "./pages/OpportunityDetail"

function App(){

return(

<>

<Navbar/>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/discover" element={<Discover />} />

<Route path="/opportunities" element={<Opportunities />} />

<Route path="/opportunity/:id" element={<OpportunityDetail />} />

</Routes>

</>

)

}

export default App