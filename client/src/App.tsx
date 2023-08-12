
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import Root from './Root';
import Navbar from './components/Navbar/Navbar';

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <div className='rootDiv'>
          <Root />
        </div>
      </Router>
    </>
  )
}

export default App
