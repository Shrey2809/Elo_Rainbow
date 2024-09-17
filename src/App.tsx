import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MapData from './MapData';
import EloData from './EloData';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <h1 className="pt-10 text-white text-2xl md:text-3xl lg:text-4xl text-center px-4 sm:px-6">
          Elo Rankings for Rainbow Six Siege
        </h1>
        <div className="mt-6 flex justify-center space-x-4 px-4 sm:px-6">
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-myDarkColor text-white rounded"
          >
            Elo Rankings
          </button>
          <button
            onClick={() => window.location.href = "/maps"}
            className="px-4 py-2 bg-myDarkColor text-white rounded"
          >
            Map by Map Elo Rankings
          </button>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<EloData />} /> 
        <Route path="/maps" element={<MapData />} />
      </Routes>
    </Router>
  );
}

export default App;