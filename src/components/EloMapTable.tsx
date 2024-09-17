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

import TeamsMaps from "../mapData.json";

type TeamMapsJSON = {
  ID: number;
  LastGameUpdated: number;
  TeamName: string;
  MapName: string;
  Elo: number;
  Region: string;
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
};

const transformData = (data: TeamsMapsData): EloMapsData[] => {
  // Sort the teams by Elo rating in descending order
  const sortedTeams = data.TeamsMaps.map((team) => ({
    id: team.ID,
    elo: team.Elo,
    team: team.TeamName,
    map: team.MapName,
    region: team.Region,
  })).sort((a, b) => b.elo - a.elo);

  return sortedTeams.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));
};


const transformedData = transformData(TeamsMaps);

const rowsPerPage = 20;

export default function EloTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [searchMap, setSearchMap] = useState("");

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSearchRegionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchRegion(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleSearchMapChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchMap(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredData = transformedData.filter(
    (data) =>
      data.team.toLowerCase().includes(searchQuery) &&
      data.region.toLowerCase().includes(searchRegion) &&
      data.map.toLowerCase().includes(searchMap),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

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
        <input
          type="text"
          placeholder="Search by map"
          value={searchMap}
          onChange={handleSearchMapChange}
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
            <TableHead className="w-1/6 text-white text-center font-bold">
              Rank
            </TableHead>
            <TableHead className="w-1/6 text-white text-center font-bold">
              Logo
            </TableHead>
            <TableHead className="w-1/6 text-white text-center font-bold">
              Team
            </TableHead>
            <TableHead className="w-1/6 text-white text-center font-bold">
              Elo
            </TableHead>
            <TableHead className="w-1/6 text-white text-center font-bold">
              Map
            </TableHead>
            <TableHead className="w-1/6 text-white text-center font-bold">
              Region
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRows.map((data) => (
            <TableRow key={data.id}>
              <TableCell className="w-1/6 text-center font-semibold">
                {data.rank}
              </TableCell>
              <TableCell className="w-1/6 text-center font-semibold">
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
              <TableCell className="w-1/6 text-center font-semibold">
                {data.team}
              </TableCell>
              <TableCell className="w-1/6 text-center font-semibold">
                {Math.round(data.elo)}
              </TableCell>
              <TableCell className="w-1/6 text-center font-semibold">
                {data.map}
              </TableCell>
              <TableCell className="w-1/6 text-center font-semibold">
                {data.region}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
