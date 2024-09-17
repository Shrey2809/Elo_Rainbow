import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EloTable from './components/EloTable';
import MapData from './MapData';

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <h1 className="pt-10 text-white text-2xl md:text-3xl lg:text-4xl text-center px-4 sm:px-6">
          Elo Rankings for Rainbow Six Siege
        </h1>
        <h2 className="text-center text-lg md:text-xl lg:text-2xl px-4 sm:px-6">
          <Link to="/maps">Go to Maps Data</Link>
        </h2>
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <EloTable />
        </div>
      </div>

      <Routes>
        <Route path="/maps" element={<MapData/>} />
      </Routes>
    </Router>
  );
}

export default App;
