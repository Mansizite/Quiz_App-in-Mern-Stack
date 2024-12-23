import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './Components/Main';
import Dash from './Components/Dash';
import Score from './Components/Score';


function App() {
  return (
    <div className="App">
      <Router>
        {/* Define routes here */}
        <Routes>
          <Route path="/" element={<Dash />} />      
          <Route path="/main" element={<Main />} />
          <Route path="/scores" element={<Score/>} />
          
     
        </Routes>
      </Router>
    </div>
  );
}

export default App;
