import React, { useState } from 'react';
import Finish from "../finish.json"; // Teams data (imported from JSON)

// Define types for Team data
type FinishJSON = {
  TeamName: string;
  FinishRequired: string;
  PointsAtFinish: number;
  CurrentPoints: number;
  Region: string;
};

type FinishData = {
  Finish: FinishJSON[];
};

// List of available regions
const regions = ["ALL REGIONS", "NA", "BR", "EU", "JAPAN", "KOREA", "LATAM", "MENA", "OCE", "SEA"];

export default function SidebarCards() {
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering
  const [searchRegion, setSearchRegion] = useState(""); // Region filter

  // Handle team search query change
  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle region search query change
  const handleSearchRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRegion(event.target.value);
  };

  // Filter teams based on search query and region filter
  const filteredTeams = Finish.Finish.filter(
    (team) =>
      team.TeamName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      team.Region.toLowerCase().includes(searchRegion.toLowerCase())
  );

  return (
    <div className="flex flex-col items-start p-4 w-64 bg-myDarkColor text-center">
        <h2 className="text-xl font-bold text-mySecondaryColor">Finish Requirements</h2>
        <div className="flex flex-col gap-4 w-full">
        {filteredTeams.map((team, index) => (
            <div key={index} className="p-4 bg-mySecondaryColor text-myDarkColor rounded shadow-lg">
                <h3 className="text-lg font-bold"> 
                    <img
                        src={`/team_logos/${team.TeamName.toLowerCase()}.png`}
                        alt={team.TeamName}
                        className="w-10 h-10 mx-auto"
                        loading="lazy"
                        onError={(e) => {
                        e.currentTarget.src = "/team_logos/no_org.png";
                        }}
                    />
                    {team.TeamName}
                </h3>
                <p><span className='font-bold'>Region:</span> {team.Region}</p>
                <p><span className='font-bold'>Finish Required:</span> {team.FinishRequired}</p>
                <p><span className='font-bold'>Current Points:</span> {team.CurrentPoints}</p>
            </div>
        ))}
        </div>
    </div>
  );
}
