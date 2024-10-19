import React, { useState } from 'react';
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
import mergedData from "../merged_SIData.json"; // Import merged data
import { Button } from "./ui/button"; // Button component

type TeamJSON = {
  TeamName: string;
  Probability: number;
  Region: string;
  FinishRequired: string;  // Added FinishRequired field
};

type TeamsData = {
  Teams: TeamJSON[];
};

type EloData = {
  rank: number;
  team: string;
  percentage: number;
  region: string;
  finishRequired: string;  // Added FinishRequired field to EloData
};

// List of available regions
const regions = ["ALL REGIONS", "NA", "BR", "EU", "JAPAN", "KOREA", "LATAM", "MENA", "OCE", "SEA"];

// Function to transform raw team data into EloData format and sort by probability
const transformData = (data: TeamsData): EloData[] => {
  const sortedTeams = data.Teams.map((team) => ({
    percentage: team.Probability,
    team: team.TeamName,
    region: team.Region,
    finishRequired: team.FinishRequired,  // Include FinishRequired
  })).sort((a, b) => b.percentage - a.percentage); // Sort teams by percentage

  return sortedTeams.map((team, index) => ({
    ...team,
    rank: index + 1, // Assign a rank based on sorted order
  }));
};

const transformedData = transformData(mergedData); // Apply transformation to merged data
const bleedRank = transformedData.find((team) => team.team === "Bleed")?.rank;

const rowsPerPage = 20; // Set the number of rows to display per page

export default function SIProbabilites() {
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [searchQuery, setSearchQuery] = useState(""); // Track team search query
  const [searchRegion, setSearchRegion] = useState(""); // Track region search query
  const [popoverOpen, setPopoverOpen] = useState(false); // Track popover visibility

  const [, setSelectedRegion] = useState<string>(""); // State to hold selected region
  

  // Handle region selection in the popover
  const handleRegionSelect = (region: string) => {
    if (region === "ALL REGIONS") {
      setSearchRegion(""); // Reset region filter if "ALL REGIONS" is selected
    } else {
      setSelectedRegion(region); // Set the selected region
      setSearchRegion(region); // Filter data by region
    }
    setPopoverOpen(false); // Close the popover after selection
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle team search query change
  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value); // Set the search query
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  // Handle region search query change
  const handleSearchRegionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchRegion(event.target.value); // Set the region filter
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  // Filter teams based on search query and region filter
  const filteredData = transformedData.filter(
    (data) =>
      data.team.toLowerCase().includes(searchQuery.toLowerCase()) &&
      data.region.toLowerCase().includes(searchRegion.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex); // Get current page rows
  const totalPages = Math.ceil(filteredData.length / rowsPerPage); // Calculate total pages

  

  return (
    <div className="w-full">
      {/* Display last calculation date and average minimum points */}
      <div className="items-center flex flex-row gap-8 justify-center font-normal font-sans">

        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Avg Min Points <br/><b>{Math.round(mergedData.MinPoints / 5) * 5}</b>
        </div>
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Simulations <br/><b>1 million runs</b>
        </div>
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Last updated (UTC) <br/><b>{mergedData.Date}</b>
        </div>
      </div>

      {/* Search filters for team and region */}
      <div className="p-4 flex gap-4 font-sans">
        <input
          type="text"
          placeholder="Search Team Name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search Region"
          value={searchRegion}
          onChange={handleSearchRegionChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
        />
      </div>

      {/* Table displaying team probabilities */}
      <Table className="text-sm md:text-lg table-auto w-full">
        <TableCaption className="text-white text-xl">
          Matchups data and logos provided by Liquipedia. Created by {""}
          <a href="https://x.com/ItzAxon" className="text-myFourthColor underline">Axon</a>
          {/* Pagination controls */}
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

        {/* Table headers */}
        <TableHeader className="bg-myDarkColor">
          <TableRow>
            <TableHead className="w-[10%] text-white text-center font-bold">
              #
            </TableHead>
            <TableHead className="w-[22.5%] text-white text-center font-bold">
              Team
            </TableHead>
            <TableHead className="w-[22.5%] text-white text-center font-bold">
              Chance
            </TableHead>
            <TableHead className="w-[22.5%] text-white text-center font-bold">
              Finish Required
            </TableHead>
            <TableHead className="w-[22.5%] text-white text-center font-bold">
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

        {/* Table body with team data */}
        <TableBody>
          {currentRows.map((data) => (
            <TableRow
              className={data.percentage === 1 ? 'border-b-4 border-t-4 border-mySecondaryColor text-mySecondaryColor font-extrabold drop-shadow-xl' : 'font-semibold'}
              key={data.rank}
            >
              <TableCell className="w-[10%] text-center ">
                {data.rank}
              </TableCell>
              <TableCell className="w-[22.5%] text-center">
                <img
                  src={`/team_logos/${data.team.toLowerCase()}.png`}
                  alt={data.team}
                  className="w-10 h-10 mx-auto"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/team_logos/no_org.png";
                  }}
                />
                <span>{data.team}</span>
              </TableCell>
              <TableCell className="w-[22.5%] text-center">
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <Button variant="link" className={data.percentage === 1 ? "text-lg font-extrabold" : "text-lg"}>
                      {data.percentage === 1 ? "100.00" : (Math.floor(data.percentage * 100 * 100) / 100).toFixed(2)}%
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className={data.percentage === 1 ? "w-fit bg-mySecondaryColor text-black font-semibold rounded border-0 drop-shadow-2xl" : "w-fit bg-myFourthColor text-black rounded border-0 drop-shadow-2xl"}>
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {data.percentage === 1 ? `${data.team} has qualified for SI` : `${data.team} has ${(data.percentage * 100).toFixed(4)}% chance of qualifying for SI`}
                        </h4>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="w-[22.5%] text-center font-semibold text-lg">
              {data.percentage === 1 ? <img src={`/SI.png`}
                                                alt={data.team}
                                                className="w-10 h-10 mx-auto drop-shadow-xl"
                                                loading="lazy"
                                              /> :
              data.rank < (bleedRank ?? Infinity) ? <span className="text-mySecondaryColor">Cleared</span>
                  : data.finishRequired !== 'none' ? `${data.finishRequired}`
                  : <span className="text-myFourthColor">NQ</span>}
              </TableCell>
              <TableCell className="w-[22.5%] text-center ">
                {data.region}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
