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
// Determine which tab is currently active based on the location
const currentTab = location.pathname === "/maps"
  ? "map-elo"
  : location.pathname === "/si-probabilities"
  ? "si-probabilities"
  : "elo";


  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans ">
      <div className="w-full max-w-7xl p-4 gap-4">
        <h1 className="pt-30 text-white text-2xl md:text-3xl lg:text-6xl text-center">
          EloRainbow6
        </h1>
        <h2 className="text-white text-lg md:text-xl lg:text-xl text-center">
        Team Skill Rankings
        </h2>
        <Tabs defaultValue={currentTab} className="w-full mt-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 bg-myColor rounded">
            <TabsTrigger
              value="elo"
              className={`px-4 py-2 rounded transition-colors text-xl ${currentTab === "elo" ? " text-myDarkColor border-solid border-b-2 border-white" : "bg-myColor text-gray-300"}`}
            >
              Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="map-elo"
              className={`px-4 py-2 rounded transition-colors text-xl ${currentTab === "map-elo" ? "bg-myDarkColor text-white border-solid border-b-2 border-white" : "bg-myColor text-gray-300"}`}
            >
              Map Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="si-probabilities"
              className={`px-4 py-2 rounded transition-colors text-xl ${currentTab === "si-probabilities" ? "bg-myDarkColor text-white border-solid border-b-2 border-white" : "bg-myColor text-gray-300"}`}
            >
              SI Probabilites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TopBar;

