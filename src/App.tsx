import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './Header'
import Projects from './Projects'
import Blog from './Blog'
import Home from './Home'
import Spacecannon from './Spacecannon'
import Ideas from './Ideas'
import Books from './Books'

function App() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/books" element={<Books />} />
          <Route path="/spacecannon" element={<Spacecannon />} />
        </Routes>
      </BrowserRouter>
    )
  }

  export default App