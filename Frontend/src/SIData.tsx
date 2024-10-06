import SIProbabilites from "./components/SIProbabilities";

const SIData = () => {
  return (
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <SIProbabilites />
        </div>
      </div>
  );
};

export default SIData;
