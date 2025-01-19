import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MapData from './MapData';
import EloData from './EloData';
import SIData from './SIData';
import TopBar from './components/TopBar';
import Picker from './Picker';
import PickemsPage from './PickemsPage';
import SIPicksPage from './components/SIPicks';

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<EloData />} /> 
        <Route path="/maps" element={<MapData />} />
        <Route path="/si-probabilities" element={<SIPicksPage />} />
        <Route path="/si-picker" element={<Picker />} />
        <Route path="/pickems" element={<PickemsPage />} />
        <Route path="/si-picks" element={< SIData/>} />
      </Routes>  
    </Router>
  );
}

export default App;