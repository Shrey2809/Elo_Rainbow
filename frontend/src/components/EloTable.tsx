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

import Teams from "../../public/Sample.json"; // Use relative path if necessary

// Define the type for the JSON data structure
type TeamJSON = {
  ID: number;
  LastGameUpdated: number; // Not used for rank but kept for data structure consistency
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

// Transform function with sorting by Elo rating
const transformData = (data: TeamsData): EloData[] => {
  // Sort the teams by Elo rating in descending order
  const sortedTeams = data.Teams.map((team) => ({
    id: team.ID,
    elo: team.Elo,
    team: team.TeamName,
    region: team.Region,
  })).sort((a, b) => b.elo - a.elo);

  // Assign ranks based on the sorted order
  return sortedTeams.map((team, index) => ({
    ...team,
    rank: index + 1, // Rank is 1-based
  }));
};

// Example usage
const transformedData = transformData(Teams);

const rowsPerPage = 16;

export default function EloTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRegion, setSearchRegion] = useState("");

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handleSearchRegionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchRegion(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when search region changes
  };

  // Filter the transformed data based on search queries
  const filteredData = transformedData.filter(
    (data) =>
      data.team.toLowerCase().includes(searchQuery) &&
      data.region.toLowerCase().includes(searchRegion),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Use `slice` on the filtered data array
  const currentRows = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="w-full">
      <div className="p-4 flex gap-4 font-sans">
        <input
          type="text"
          placeholder="Search by team name"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-violet-200 text-myDarkColor font-semibold"
        />
        <input
          type="text"
          placeholder="Search by region"
          value={searchRegion}
          onChange={handleSearchRegionChange}
          className="px-4 py-2 mb-2 rounded drop-shadow-md w-1/2 bg-violet-200 text-myDarkColor font-semibold"
        />
      </div>
      <Table className="text-xl">
        <TableCaption className="text-white">
          Matchup data to calculate Elo provided by Liquipedia.
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
            <TableHead className="w-[100px] text-white">Rank</TableHead>
            {/*<TableHead className="text-white">Logo</TableHead>*/}
            <TableHead className="text-white">Team</TableHead>
            <TableHead className="text-white">Elo</TableHead>
            <TableHead className="text-white">Region</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.rank}</TableCell>
              {/*<TableCell></TableCell>*/}
              <TableCell>{data.team}</TableCell>
              <TableCell>{data.elo}</TableCell>
              <TableCell>{data.region}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
