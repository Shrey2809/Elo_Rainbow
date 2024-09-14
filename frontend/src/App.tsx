import EloTable from "./components/EloTable";

function App() {
  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
      <h1 className="pt-10 text-white text-3xl">
        Elo Rankings for Rainbow Six Siege
      </h1>
      <div className="w-[90%] flex flex-col items-center justify-center pt-8">
        <EloTable />
      </div>
    </div>
  );
}

export default App;
