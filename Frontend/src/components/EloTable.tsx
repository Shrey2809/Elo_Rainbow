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
};

const regions = ["ALL REGIONS", "NORTH AMERICA", "BR", "EU", "JAPAN", "KOREA", "LATAM", "MENA", "OCE", "SEA"];

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
  }));
};

const transformedData = transformData(Teams);

const rowsPerPage = 20;

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

  return (
    <div className="w-full">
      <div className="items-center flex flex-row justify-center font-normal font-sans md:gap-4 lg:gap-6 xl:gap-8">
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Last updated <br/><b>{formattedDate} {timezoneAbbreviation}</b>
        </div>
      </div>
      <div className="p-4 flex flex-col md:flex-row gap-4 font-sans">
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
              <TableHead className="w-[10%] text-white text-center font-bold">
                #
              </TableHead>
              <TableHead className="w-[30%] text-white text-center font-bold">
                Team
              </TableHead>
              <TableHead className="w-[30%] text-white text-center font-bold">
                Elo
              </TableHead>
              <TableHead className="w-[30%] text-white text-center font-bold">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger className="w-full cursor-pointer flex flex-row items-center justify-center pl-6">
                    Region <img src={`/dropdown.svg`} className="w-5 h-5 mx-2" />
                  </PopoverTrigger>
                  <PopoverContent className="p-4 bg-myDarkColor">
                    <div className="flex flex-col">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className="py-2 px-4 text-white text-lg hover:bg-myColor"
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
              <TableRow key={data.id}>
                <TableCell className="w-[10%] text-center font-semibold">
                  {data.rank}
                </TableCell>
                <TableCell className="w-[30%] text-center font-semibold">
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
                <TableCell className="w-[30%] text-center font-semibold">
                  {Math.round(data.elo)}
                </TableCell>
                <TableCell className="w-[30%] text-center font-semibold">
                  {data.region}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
