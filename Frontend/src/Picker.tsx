import SIPicker from "./components/SIPicker";

const Picker = () => {
  return (
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <SIPicker/>
        </div>
      </div>
  );
};

export default Picker;
