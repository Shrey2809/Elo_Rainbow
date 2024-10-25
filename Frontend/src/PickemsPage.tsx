import Pickems from "./components/Pickems";

const PickemsPage = () => {
  return (
      <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
        <div className="w-[90%] flex flex-col items-center justify-center pt-8">
          <Pickems />
        </div>
      </div>
  );
};

export default PickemsPage;
