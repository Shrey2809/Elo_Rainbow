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

import Teams from "../SIData.json";

type TeamJSON = {
  TeamName: string;
  Probability: number;
  Region: string;
};

type TeamsData = {
  Teams: TeamJSON[];
};

type EloData = {
  rank: number;
  team: string;
  percentage: number;
  region: string;
};

// const regions = [ "Asia", "Brazil", "Europe", "Japan", "Korea", "Latin America", "Middle East & North Africa", "North America", "Oceania", ];
const regions = ["NA", "BR", "EU", "JAPAN", "KOREA", "LATAM", "MENA", "OCE", "SEA"];

const transformData = (data: TeamsData): EloData[] => {
  // Sort the teams by Elo rating in descending order
  const sortedTeams = data.Teams.map((team) => ({
    percentage: team.Probability,
    team: team.TeamName,
    region: team.Region,
  })).sort((a, b) => b.percentage - a.percentage);

  return sortedTeams.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
};

const transformedData = transformData(Teams);

const rowsPerPage = 16;

export default function SIProbabilites() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [, setSelectedRegion] = useState<string>("");
  // Handle region selection
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSearchRegion(region); // Update the searchRegion state to filter data by selected region
    setPopoverOpen(false);
  }

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
      <div className="items-center justify-left font-normal font-sans">
        <h1 className="text-white text-lg md:text-xl lg:text-xl text-center">SI Probabilities: Last game considered is VP SECRET in EUL Playoffs</h1>
        <h1 className="text-white text-lg md:text-xl lg:text-xl text-center">DISCLAIMER: I don't claim this is 100% accurate, but rather should give an idea for who might have an approximate chance of qualifying for SI off of points</h1>
        <h1 className="text-white text-lg md:text-xl lg:text-xl text-center">Overview: Teams either have a locked in stage 2 regional position, or a range they can get. 
                This is used to simulate a final state of stage 2 regional positions. 
                This in turn is used to randomly assign positions at the Major, based on if they start in phase 1 or phase 2. 
                This is simulated a large number of times, and the probability is calculated as the number of times a team qualifies for SI off of points.</h1>
        <h1 className="text-white text-lg md:text-xl lg:text-xl text-center">Currently, this is run for 100k simulations.</h1>
        <h1 className="text-white text-lg md:text-xl lg:text-xl text-center">
          If you have questions, feel free to reach out to me on <a href="https://x.com/ItzAxon" className="text-blue-500 underline">Twitter</a>
        </h1>
      </div>
      <div className="p-4 flex gap-4 font-sans">
        <input
          type="text"
          placeholder="Search Team Name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-violet-200 text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search Region"
          value={searchRegion}
          onChange={handleSearchRegionChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-violet-200 text-myDarkColor font-semibold"
        />
      </div>
      <Table className="text-xl table-fixed">
        <TableCaption className="text-white text-xl">
          Matchups data and logos provided by Liquipedia. Coded by Axon319
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
            <TableHead className="w-1/5 text-white text-center font-bold">
              Rank
            </TableHead>
            <TableHead className="w-1/5 text-white text-center font-bold">
              Logo
            </TableHead>
            <TableHead className="w-1/5 text-white text-center font-bold">
              Team
            </TableHead>
            <TableHead className="w-1/5 text-white text-center font-bold">
              Chance
            </TableHead>
            <TableHead className="w-1/5 text-white text-center font-bold">
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
                        className="py-2 px-4 text-white text-xl hover:bg-myColor"
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
              className={data.percentage === 1 ? 'bg-mySecondaryColor hover:bg-mySecondaryColor' : ''}
              key={data.rank}
            >
              <TableCell className="w-1/5 text-center font-semibold">
                {data.rank}
              </TableCell>
              <TableCell className="w-1/5 text-center font-semibold">
                <img
                  src={`/team_logos/${data.team.toLowerCase()}.png`}
                  alt={data.team}
                  className="w-10 h-10 mx-auto"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/no_org.png";
                  }}
                />
              </TableCell>
              <TableCell className="w-1/5 text-center font-semibold">
                {data.team}
              </TableCell>
              <TableCell className="w-1/5 text-center font-semibold">
                {(data.percentage * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="w-1/5 text-center font-semibold">
                {data.region}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
