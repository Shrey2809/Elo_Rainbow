import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MapData from './MapData';
import EloData from './EloData';
import SIData from './SIData';
import TopBar from './components/TopBar';
import Picker from './Picker';

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<EloData />} /> 
        <Route path="/maps" element={<MapData />} />
        <Route path="/si-probabilities" element={<SIData />} />
        <Route path="/si-picker" element={<Picker />} />
      </Routes>  
    </Router>
  );
}

export default App;