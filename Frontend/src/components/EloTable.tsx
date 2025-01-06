import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";

import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";

import Teams from "../data.json";

type TeamJSON = {
  ID: number;
  LastGameUpdated: number;
  TeamName: string;
  Elo: number;
  Region: string;
};

type TeamsData = {
  Teams: TeamJSON[];
};

type EloData = {
  id: number;
  rank: number;
  team: string;
  elo: number;
  region: string;
  rankName: string;
};

type RankName = "S-Tier" | "A-Tier" | "B-Tier" | "C-Tier" | "D-Tier" | "F-Tier";

const regions = ["ALL REGIONS", "NORTH AMERICA", "BR", "EU", "JAPAN", "KOREA", "LATAM", "MENA", "OCE", "SEA"];
// Create a dict for ranks based on elo ranges
const rank: { [key in RankName]: [number, number] } = {
  "S-Tier" : [1700, 9999],
  "A-Tier" : [1550, 1674.99],
  "B-Tier" : [1425, 1549.99],
  "C-Tier" : [1300, 1424.99],
  "D-Tier" : [1175, 1299.99],
  "F-Tier" : [0, 1174.99],
}
const getRank = (elo: number): string => {
  for (const [rankName, [minElo, maxElo]] of Object.entries(rank)) {
    if (elo >= minElo && elo <= maxElo) {
      return rankName;
    }
  }
  return "Unranked"; // In case Elo is outside expected range
};

const transformData = (data: TeamsData): EloData[] => {
  const sortedTeams = data.Teams.map((team) => ({
    id: team.ID,
    elo: team.Elo,
    team: team.TeamName,
    region: team.Region,
  })).sort((a, b) => b.elo - a.elo);

  return sortedTeams.map((team, index) => ({
    ...team,
    rank: index + 1,
    rankName: getRank(team.elo),
  }));
};

const transformedData = transformData(Teams);

const rowsPerPage = 20;

const getRankCounts = (data: EloData[]) => {
  // Initialize rank counts as an array of objects
  const counts = [
    { rank: "F-Tier", count: 0, logo: "/ranks/f-tier.png" },
    { rank: "D-Tier", count: 0, logo: "/ranks/d-tier.png" },
    { rank: "C-Tier", count: 0, logo: "/ranks/c-tier.png" },
    { rank: "B-Tier", count: 0, logo: "/ranks/b-tier.png" },
    { rank: "A-Tier", count: 0, logo: "/ranks/a-tier.png" },
    { rank: "S-Tier", count: 0, logo: "/ranks/s-tier.png" },
  ];

  // Increment the count for each team's rank
  data.forEach((team) => {
    const rankObj = counts.find((r) => r.rank === team.rankName);
    if (rankObj) {
      rankObj.count += 1;
    }
    
  });

  return counts;
};

const rankCounts = getRankCounts(transformedData);

// Your timestamp from JSON
let timestamp = Teams.Date; 

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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [, setSelectedRegion] = useState<string>("");

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

  const filteredData = transformedData.filter(
    (data) =>
      data.team.toLowerCase().includes(searchQuery.toLowerCase()) &&
      data.region.toLowerCase().includes(searchRegion.toLowerCase()),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const is_display = false;

  const CustomBar = (props: { x: number; y: number; width: number; height: number; logo: string }) => {
    const { x, y, width, height, logo } = props;
    return (
      <g>
        {/* Render the logo above the bar */}
        <image
          href={`${logo.toLowerCase()}`}
          x={x + width / 2 - 24} // Center the logo above the bar
          y={y - 55} // Position above the bar
          height={48}
          width={48}
        />
        {/* Render the actual bar */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#2F3037"
          stroke="#D7DEDC"
          strokeWidth={4}
          rx={5} // For rounded corners
          ry={5} // For rounded corners
          style={{ pointerEvents: 'none' }}
        />
      </g>
    );
  };

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
              {/* <div className="text-center font-bold mb-4">Ranking Breakdown</div> */}
              <div className="flex flex-row items-center gap-4">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <div className="flex flex-col">
                      
                        {Object.keys(rank).map((rankName) => (
                        <div
                          key={rankName}
                          className="font-semibold flex flex-row items-start justify-start mb-2"
                        >
                          <img
                            src={`/ranks/${rankName.toLowerCase()}.png`}
                            className="w-12 h-12 mr-4 drop-shadow-xl"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                          />
                          <div className="items-center">
                            {Math.floor(rank[rankName as keyof typeof rank][0])} - {Math.floor(rank[rankName as keyof typeof rank][1])}
                          </div>
                        </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div style={{ width: 600, height: 350}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rankCounts} barSize={100}>
                      <Bar
                        dataKey="count"
                        fill="none"
                        shape={(props: any) => (
                          <CustomBar {...props} logo={rankCounts[props.index]?.logo} />
                        )}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </b>
        </div>
      </div>
      
      { is_display && <div style={{ width: "100%", height: 500}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rankCounts} barSize={100}>
          <Tooltip />
          <Bar
            dataKey="count"
            fill="none"
            shape={(props: any) => (
              <CustomBar {...props} logo={rankCounts[props.index]?.logo} />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
      </div> }


      <div className="p-4 flex flex-col md:flex-row gap-4 font-sans items-center">
        <input
          type="text"
          placeholder="Search Team Name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search Region"
          value={searchRegion}
          onChange={handleSearchRegionChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <button onClick={() => {setSearchQuery(""); setSearchRegion("");}}
                className="w-32 py-2 mb-2 bg-myFourthColor text-black font-bold rounded justify-center hover:bg-myFifthColor">
          Clear
        </button>
      </div>

      <div className="overflow-x-auto justify-center items-center align-middle">
        <div className="items-center">
        <Table className="text-sm md:text-lg table-auto w-full justify-between">
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
              <TableHead className="w-[10%] text-white text-center font-bold">
                #
              </TableHead>
              <TableHead className="w-[22.5%] text-white text-center font-bold">
                Tier
              </TableHead>
              <TableHead className="w-[22.5%] text-white text-center font-bold">
                Team
              </TableHead>
              <TableHead className="w-[22.5%] text-white text-center font-bold">
                Elo
              </TableHead>
              <TableHead className="w-[22.5%] text-white text-center font-bold">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger className="w-full cursor-pointer flex flex-row items-center justify-center pl-6">
                    Region <img src={`/dropdown.svg`} className="w-5 h-5 mx-2" />
                  </PopoverTrigger>
                  <PopoverContent className="mt-2 bg-myDarkColor border-none rounded-xl drop-shadow-2xl">
                    <div className="flex flex-col">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className="py-2 text-white text-lg hover:bg-myColor rounded-xl"
                        >
                          {region}
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
                <TableCell className="w-[10%] text-center font-semibold">
                  {data.rank}
                </TableCell>
                <TableCell className="w-[22.5%] text-center font-semibold">
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
                <TableCell className="w-[22.5%] text-center font-semibold">
                  <img
                    src={`/team_logos/${data.team.toLowerCase()}.png`}
                    alt={data.team}
                    className="w-10 h-10 mx-auto drop-shadow-xl"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/team_logos/no_org.png";
                    }}
                  />
                  <span>{data.team}</span>
                </TableCell>
                <TableCell className="w-[22.5%] text-center font-semibold">
                  {Math.round(data.elo)}
                </TableCell>
                <TableCell className="w-[22.5%] text-center font-semibold">
                  {data.region}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
