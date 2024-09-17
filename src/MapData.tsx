import EloMapTable from "./components/EloMapTable";
import TopBar from "./components/TopBar";

const MapData = () => {
  return (
    <div>
      <TopBar />
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <EloMapTable />
        </div>
      </div>
    </div>
  );
};

export default MapData;
