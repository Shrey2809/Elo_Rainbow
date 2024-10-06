import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MapData from './MapData';
import EloData from './EloData';
import SIData from './SIData';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<EloData />} /> 
        <Route path="/maps" element={<MapData />} />
        <Route path="/si-probabilities" element={<SIData />} />
      </Routes>  

    </Router>
  );
}

export default App;