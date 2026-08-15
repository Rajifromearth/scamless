import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Check from './pages/Check'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/check" element={<Check />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App