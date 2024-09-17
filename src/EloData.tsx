import EloTable from "./components/EloTable";

const MapData = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
      <div className="w-[90%] flex flex-col items-center justify-center pt-8">
        <EloTable />
      </div>
    </div>
  );
};

export default MapData;
