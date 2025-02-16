import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import TeamsMaps from "../mapData.json";
import { Button } from "./ui/button";
// import Date from "../mapData.json"

type TeamMapsJSON = {
  ID: number;
  LastGameUpdated: number;
  TeamName: string;
  MapName: string;
  Elo: number;
  Region: string;
  MajorCount: number;
  RegionalCount: number;
};

type TeamsMapsData = {
  TeamsMaps: TeamMapsJSON[];
};

type EloMapsData = {
  id: number;
  rank: number;
  team: string;
  map: string;
  elo: number;
  region: string;
  majorCount: number;
  regionalCount: number;
  rankName: string;
};

type RankName = "S-Tier" | "A-Tier" | "B-Tier" | "C-Tier" | "D-Tier" | "F-Tier";
const maps = ["ALL MAPS", "BANK", "BORDER", "CHALET", "CLUB", "CONS", "KAFE", "LABS", "LAIR", "OREGON", "SKYSCRAPER"];
const regions = ["ALL REGIONS", "NAL", "SAL", "EML", "APL"];
const rank: { [key in RankName]: [number, number] } = {
  "S-Tier" : [1600, 9999],
  "A-Tier" : [1500, 1599.99],
  "B-Tier" : [1400, 1499.99],
  "C-Tier" : [1300, 1399.99],
  "D-Tier" : [1200, 1299.99],
  "F-Tier" : [0, 1199.99],
}
const getRank = (elo: number): string => {
  for (const [rankName, [minElo, maxElo]] of Object.entries(rank)) {
    if (elo >= minElo && elo <= maxElo) {
      return rankName;
    }
  }
  return "Unranked"; // In case Elo is outside expected range
};

const transformData = (data: TeamsMapsData): EloMapsData[] => {
  const teamsByMap: { [map: string]: TeamMapsJSON[] } = {};

  data.TeamsMaps.forEach((team) => {
    if (!teamsByMap[team.MapName]) {
      teamsByMap[team.MapName] = [];
    }
    teamsByMap[team.MapName].push(team);
  });

  const mapNames = Object.keys(teamsByMap).sort();

  const rankedTeams: EloMapsData[] = [];

  mapNames.forEach((map) => {
    const teams = teamsByMap[map];

    const sortedTeams = teams
      .map((team) => ({
        id: team.ID,
        elo: team.Elo,
        team: team.TeamName,
        map: team.MapName,
        region: team.Region,
        majorCount: team.MajorCount,
        regionalCount: team.RegionalCount,
      }))
      .sort((a, b) => b.elo - a.elo);

    sortedTeams.forEach((team, index) => {
      rankedTeams.push({
        ...team,
        rank: index + 1,
        rankName: getRank(team.elo),
      });
    });
  });

  return rankedTeams;
};

const transformedData = transformData(TeamsMaps);

const rowsPerPage = 20;

// Your timestamp from JSON
let timestamp = TeamsMaps.Date; 

// Parse the string into a Date object
let date = new Date(timestamp + " UTC");

// Get the user's local timezone
let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Convert and display the date in the user's timezone
let userDate = date.toLocaleString('en-US', { timeZone: userTimezone, month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
let timezoneAbbreviation = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];

// Format userDate to match the structure
let formattedDate = userDate.replace(',', '');

export default function EloTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [searchMap, setSearchMap] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverMapOpen, setPopoverMapOpen] = useState(false);

  const [, setSelectedMap] = useState<string>("");
  const [, setSelectedRegion] = useState<string>("");

  const handleMapSelect = (map: string) => {
    if (map === "ALL MAPS") {
      setSearchMap("");
    } else {
      setSelectedMap(map);
      setSearchMap(map);
    }
    setPopoverMapOpen(false);
  };

  const handleRegionSelect = (region: string) => {
    if (region === "ALL REGIONS") {
      setSearchRegion("");
    } else {
      setSelectedRegion(region);
      setSearchRegion(region);
    }
    setPopoverOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchRegionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchRegion(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchMapChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchMap(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = transformedData.filter(
    (data) =>
      data.team.toLowerCase().includes(searchQuery.toLowerCase()) &&
      data.region.toLowerCase().includes(searchRegion.toLowerCase()) &&
      data.map.toLowerCase().includes(searchMap.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="w-full">
      <div className="items-center flex flex-row justify-center font-normal font-sans md:gap-4 lg:gap-6 xl:gap-8">
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Last updated <br/><b>{formattedDate} {timezoneAbbreviation}<br/>
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild>
              <Button variant="link" className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  font-bold">
              <u>Ranking breakdown</u>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit bg-myDarkColor text-white rounded-xl border-0 drop-shadow-2xl">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <div className="flex flex-col">
                    {Object.keys(rank).map((rankName) => (
                      <div
                        key={rankName}
                        className="font-semibold flex flex-row items-center justify-start mb-4"
                      >
                        <img
                          src={`/ranks/${rankName.toLowerCase()}.png`}
                          className="w-10 h-10 mr-4 drop-shadow-xl"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/team_logos/no_org.png";
                          }}
                        />
                        <span>
                          {Math.floor(rank[rankName as keyof typeof rank][0])} - {Math.floor(rank[rankName as keyof typeof rank][1])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </b>
        </div>
      </div>
        
      <div className="p-4 flex flex-col md:flex-row gap-4 font-sans items-center">
        <input
          type="text"
          placeholder="Search Team Name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/3 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search Map"
          value={searchMap}
          onChange={handleSearchMapChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/3 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search Region"
          value={searchRegion}
          onChange={handleSearchRegionChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/3 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <button onClick={() => {setSearchMap(""); setSearchQuery(""); setSearchRegion("");}}
                className="w-32 py-2 mb-2 bg-myFourthColor text-black font-bold rounded justify-center hover:bg-myFifthColor">
          Clear
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table className="text-sm md:text-lg table-auto w-full">
          <TableCaption className="text-white text-sm md:text-lg">
          Matchups data and logos provided by Liquipedia. Created by {""}
          <a href="https://x.com/ItzAxon" className="text-myFourthColor underline">Axon</a>
            <div className="pagination p-4 flex items-center justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-myDarkColor text-white rounded"
              >
                Previous
              </button>
              <span className="mx-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-myDarkColor text-white rounded"
              >
                Next
              </button>
            </div>
          </TableCaption>
          <TableHeader className="bg-myDarkColor">
            <TableRow>
              <TableHead className="w-[10%] text-white text-center font-bold">#</TableHead>
              <TableHead className="w-[18%] text-white text-center font-bold">
                Tier
              </TableHead>
              <TableHead className="w-[18%] text-white text-center font-bold">Team</TableHead>
              <TableHead className="w-[18%] text-white text-center font-bold">Elo</TableHead>
              <TableHead className="w-[18%] text-white text-center font-bold">
                <Popover open={popoverMapOpen} onOpenChange={setPopoverMapOpen}>
                  <PopoverTrigger className="w-full cursor-pointer flex flex-row items-center justify-center pl-6">
                    Map <img src={`/dropdown.png`} className="w-4 h-4 mx-2" />
                  </PopoverTrigger>
                  <PopoverContent className="mt-2 bg-myDarkColor border-none rounded-xl drop-shadow-2xl">
                    <div className="flex flex-col">
                      {maps.map((map) => (
                        <button
                          key={map}
                          onClick={() => handleMapSelect(map)}
                          className="px-4 py-2 bg-myDarkColor text-white rounded hover:bg-myColor"
                        >
                          {map}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              <TableHead className="w-[18%] text-white text-center font-bold">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger className="w-full cursor-pointer flex flex-row items-center justify-center pl-6">
                    Region <img src={`/dropdown.png`} className="w-4 h-4 mx-2" />
                  </PopoverTrigger>
                  <PopoverContent className="mt-2 bg-myDarkColor border-none rounded-xl drop-shadow-2xl">
                    <div className="flex flex-col">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className="py-2 px-4 text-white text-xl hover:bg-myColor"
                        >
                          <img 
                            src={`/regions/${region.toLowerCase()}.png`}
                            alt={region}
                            className="w-14 h-fit mx-auto drop-shadow-xl"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/regions/world.png";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((data) => (
              <TableRow
                  key={data.id}
                  className="odd:bg-myColor even:bg-mySecondCellColor even:hover:bg-mySecondCellColor border-none hover:bg-none"
                >
                <TableCell className="w-[10%] text-center font-bold text-2xl">
                  {data.rank}
                </TableCell>
                <TableCell className="w-[18%] text-center font-semibold">
                  <img
                      src={`/ranks/${data.rankName.toLowerCase()}.png`}
                      alt={data.team}
                      className="w-10 h-10 mx-auto drop-shadow-xl"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/team_logos/no_org.png";
                      }}
                    />
                </TableCell>
                <TableCell className="w-[18%] text-center font-semibold">
                  <img
                    src={`/team_logos/${data.team.toLowerCase()}.png`}
                    alt={data.team}
                    className="w-12 h-12 md:w-14 md:h-14 mx-auto drop-shadow-xl"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/team_logos/no_org.png";
                    }}
                  />
                  {/* <span>{data.team}</span> */}
                </TableCell>
                <TableCell className="w-[18%] text-center font-bold text-2xl">
                  {Math.round(data.elo)}
                </TableCell>
                <TableCell className="w-[18%] text-center font-bold text-2xl">
                  <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="text-2xl md:text-2xl font-bold">
                        {data.map}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit bg-myDarkColor text-white rounded border-0 drop-shadow-2xl">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            {data.team} has played this map:
                          </h4>
                          <p className="text-sm">
                            <span className="font-semibold">
                              Majors: {data.majorCount}
                            </span>{" "}
                            <br />
                            <span className="font-semibold">
                              Regionals: {data.regionalCount}
                            </span>
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="w-[18%] text-center font-semibold">
                  <img 
                      src={`/regions/${data.region.toLowerCase()}.png`}
                      alt={data.region}
                      className="w-12 h-12 mx-auto drop-shadow-xl"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/regions/world.png";
                      }}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
