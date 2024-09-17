import EloMapTable from "./components/EloMapTable";

function MapData() {
  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
      <h1 className="pt-10 text-white text-2xl md:text-3xl lg:text-4xl text-center px-4 sm:px-6">
        Elo Rankings Per Map for Rainbow Six Siege
      </h1>
      <div className="w-[90%] flex flex-col items-center justify-center pt-8">
        <EloMapTable />
      </div>
    </div>
  );
}

export default MapData;
