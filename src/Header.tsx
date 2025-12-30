import { NavLink } from "react-router-dom"

function Header() {
    return <header> 
        <nav>
        <NavLink to="/" className="header-title"> Wiktor Łoboda </NavLink>
        
        <NavLink to="/projects" className="header-content"> my projects </NavLink>
        <NavLink to="/blog" className="header-content"> blog </NavLink>
        <NavLink to="/ideas" className="header-content"> ideas </NavLink>
        <NavLink to="/books" className="header-content"> books </NavLink>
        <NavLink to="/spacecannon" className="header-content"> space cannon </NavLink>
        </nav>
    </header>
}

export default Header