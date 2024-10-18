import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MapData from './MapData';
import EloData from './EloData';
import SIData from './SIData';
import TopBar from './components/TopBar';

function App() {
  return (
    <div className='bg-myColor'>
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<EloData />} /> 
        <Route path="/maps" element={<MapData />} />
        <Route path="/si-probabilities" element={<SIData />} />
      </Routes>  
    </Router>
    </div>
  );
}

export default App;