import SIPicks from "./components/SIPicks";

const SIPicksPage = () => {
  return (
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <SIPicks />
        </div>
      </div>
  );
};

export default SIPicksPage;
