import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    navigateTab(value);
  };

  const navigateTab = (value: string) => {
    if (value === "elo") {
      navigate("/"); // Navigate to Elo Rankings page
    } else if (value === "map-elo") {
      navigate("/maps"); // Navigate to Map Elo Rankings page
    } else if (value === "si-probabilities") {
      navigate("/si-probabilities"); // Navigate to SI Probabilities page
    } else if (value === "si-picker") {
      navigate("/si-picker"); // Navigate to SI Picker page
    } else if (value === "pickems") {
      navigate("/pickems"); // Navigate to Pickems page
    }
  };

  // Determine which tab is currently active based on the location
  const currentTab = location.pathname === "/maps"
    ? "map-elo"
    : location.pathname === "/si-probabilities"
    ? "si-probabilities"
    : location.pathname === "/si-picker"
    ? "si-picker"
    : location.pathname === "/pickems"
    ? "pickems"
    : "elo";

  return (
    <div className="flex flex-col items-center justify-center bg-myColor text-white font-sans pb-6">
      <div className="w-full max-w-7xl pt-4 gap-4">
        <h1 className="pt-6 md:pt-10 lg:pt-30 text-white text-xl md:text-3xl lg:text-6xl text-center py-8">
          <img
            src={`/Elo_R6.png`}
            className="w-3/4 md:w-1/2 h-auto mx-auto"
            loading="lazy"
          />
        </h1>

        {/* Dropdown for mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-fit bg-myDarkColor rounded px-4 py-4 text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center font-sans font-semibold flex items-center justify-center drop-shadow-xl">
              <span>
                {currentTab === "elo" ? "Elo Rankings" :
                currentTab === "map-elo" ? "Map Elo Rankings" :
                currentTab === "si-probabilities" ? "SI Probabilities" :
                currentTab === "si-picker" ? "SI Picker" : "Pickems"}
              </span>
              <img src={`/dropdown.png`} className="w-[7%] h-auto ml-2" /> {/* Add margin to the right for spacing */}

            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-full bg-myDarkColor text-myThirdColor text-3xl font-sans md:text-xl lg:text-2xl text-center p-2 font-semibold rounded-xl drop-shadow-lg">
              {["elo", "map-elo", "si-probabilities", "si-picker", "pickems"].map((tab) => (
                <DropdownMenuItem
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`text-2xl items-center ${currentTab === tab ? "bg-myDarkColor text-white" : "text-gray-400"}`}
                >
                  {tab === "elo" ? "Elo Rankings" :
                  tab === "map-elo" ? "Map Elo Rankings" :
                  tab === "si-probabilities" ? "SI Probabilities" :
                  tab === "si-picker" ? "SI Picker" : "Pickems"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs for larger screens */}
        <Tabs defaultValue={currentTab} className="hidden md:block w-full mt-4 md:mt-6" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-myColor rounded gap-2">
            <TabsTrigger
              value="elo"
              className={`flex items-center justify-center px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "elo" ? "text-myDarkColor border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="map-elo"
              className={`flex items-center justify-center px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "map-elo" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              Map Elo Rankings
            </TabsTrigger>
            <TabsTrigger
              value="si-probabilities"
              className={`flex items-center justify-center px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "si-probabilities" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              SI Probabilities
            </TabsTrigger>
            <TabsTrigger
              value="si-picker"
              className={`flex items-center justify-center px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "si-picker" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              SI Picker
            </TabsTrigger>
            <TabsTrigger
              value="pickems"
              className={`flex items-center justify-center px-2 md:px-4 py-2 rounded transition-colors text-sm md:text-xl ${currentTab === "pickems" ? "bg-myDarkColor text-white border-solid border-b-8 border-myThirdColor" : "bg-myColor text-gray-400"}`}
            >
              Pickems
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TopBar;
