import EloTable from "./components/EloTable";

function App() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="pt-16 text-slate-600 text-3xl">
        Elo Rankings for Rainbow Six Siege
      </h1>
      <div className="w-[90%] flex flex-col items-center justify-center pt-8">
        <EloTable />
      </div>
    </div>
  );
}

export default App;
