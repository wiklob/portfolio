import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './Header'
import About from './About'
import Projects from './Projects'
import Blog from './Blog'
import Home from './Home'
import Spacecannon from './Spacecannon'

function App() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home/ >} />
          <Route path="/about" element={<About/ >} />
          <Route path="/projects" element={<Projects/ >} />
          <Route path="/blog" element={<Blog/ >} />
          <Route path="/spacecannon" element={<Spacecannon/ >} />
        </Routes>
      </BrowserRouter>
    )
  }

  export default App