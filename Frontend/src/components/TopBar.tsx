import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    if (value === "elo") {
      navigate("/"); // Navigate to Elo Rankings page
    } else if (value === "map-elo") {
      navigate("/maps"); // Navigate to Map Elo Rankings page
    } else if (value === "si-probabilities") {
      navigate("/si-probabilities"); // Navigate to SI Probabilities page
    }
  };

  // Determine which tab is currently active based on the location
  const currentTab = location.pathname === "/maps"
    ? "map-elo"
    : location.pathname === "/si-probabilities"
    ? "si-probabilities"
    : "elo";

  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans">
      <div className="w-full max-w-7xl p-4 gap-4">
        <h1 className="pt-6 md:pt-10 lg:pt-30 text-white text-xl md:text-3xl lg:text-6xl text-center">
          <img
            src={`/Elo_R6.png`}
            className="w-3/4 md:w-1/2 h-auto mx-auto" // Adjust image size for mobile
            loading="lazy"
          />
        </h1>
        <Tabs defaultValue={currentTab} className="w-full mt-4 md:mt-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 bg-myColor rounded">
            <TabsTrigger
              value="elo"
              className={`px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "elo" ? " text-myDarkColor border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="map-elo"
              className={`px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "map-elo" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              Map Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="si-probabilities"
              className={`px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "si-probabilities" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              SI Probabilities
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TopBar;
