import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './Header'
import About from './About'
import Projects from './Projects'
import Blog from './Blog'
import Home from './Home'
import Spacecannon from './Spacecannon'
import Ideas from './Ideas'

function App() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home/ >} />
          <Route path="/about" element={<About/ >} />
          <Route path="/projects" element={<Projects/ >} />
          <Route path="/blog" element={<Blog/ >} />
          <Route path="/ideas" element={<Ideas/ >} />
          <Route path="/spacecannon" element={<Spacecannon/ >} />
        </Routes>
      </BrowserRouter>
    )
  }

  export default App