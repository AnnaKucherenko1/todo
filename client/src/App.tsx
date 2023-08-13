
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import Root from './Root';
import Navbar from './components/Navbar/Navbar';
import { createContext, useState } from 'react';
import { List } from './interfaces';

export const ListContext = createContext({
  lists: [] as List[],
  setLists: (_value: List[]) => { }
});

function App() {
  const [lists, setLists] = useState<List[]>([]);
  const contextValue = {
    lists,
    setLists
  };

  return (
    <>
      <Router>
        <ListContext.Provider value={contextValue}>
          <Navbar />
          <div className='rootDiv'>
            <Root />
          </div>
        </ListContext.Provider>
      </Router>
    </>
  )
}

export default App
