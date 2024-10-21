import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import teamPoints from '../team_points.json'; // Import your JSON

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


const tiers = [
  "1st",
  "2nd",
  "3rd-4th",
  "5th-8th",
  "9th-11th",
  "12th-14th",
  "15th-16th",
  "17th-20th",
  "Teams"
];

const points: Record<string, number> = { "1st": 350,
    "2nd": 260,
    "3rd-4th": 200,
    "5th-8th": 170,
    "9th-11th": 105,
    "12th-14th": 65,
    "15th-16th": 55,
    "17th-20th":45,
    "Teams": 0,}

// Helper function to calculate total points
interface Team {
  TeamName: string;
  Stage1Points: number;
  Major1Points: number;
  Stage2Points: number;
  Region: string;
  TotalPoints?: number;
  Tier?: keyof typeof points;
  MajorFlag: boolean;
}

const calculateTotalPoints = (teams: Team[]) => {
  return teams.map(team => ({
    ...team,
    TotalPoints: team.Stage1Points + team.Major1Points + team.Stage2Points + points[team.Tier ?? "Teams"],
  })).sort((a, b) => b.TotalPoints - a.TotalPoints); // Sort teams by total points
};

export default function TierListMaker() {
  const [teams] = useState(calculateTotalPoints(teamPoints.Teams));
  const [tierTeams, setTierTeams] = useState<Record<string, Team[]>>({
    "1st": [],
    "2nd": [],
    "3rd-4th": [],
    "5th-8th": [],
    "9th-11th": [],
    "12th-14th": [],
    "15th-16th": [],
    "17th-20th": [],
    "Teams": teams,
  });

  // Handle drag end event

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // No destination means item was dropped outside any droppable area
    if (!destination) return;

    // Moving within the same list
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Clone the source and destination items
    const sourceItems = Array.from(tierTeams[source.droppableId]);
    const [draggedItem] = sourceItems.splice(source.index, 1); // Remove from source
    const destItems = Array.from(tierTeams[destination.droppableId]);
    destItems.splice(destination.index, 0, draggedItem); // Add to destination

    // Update state
    setTierTeams((prev) => ({
      ...prev,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    }));
  };

  return (
    <div className="tier-list-container w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="tier-list-grid text-myThirdColor border-2">
          {tiers.map((tier) => (
            <Droppable key={tier} droppableId={tier}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="tier-row p-6 border-spacing-3 border-2 border-myThirdColor text-xl"
                >
                  <h3 >{tier}</h3>
                  {tierTeams[tier].map((team, index) => (
                    <Draggable key={team.TeamName} draggableId={team.TeamName} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="team-item sub font-semibold drop-shadow-xl text-center"
                        >
                        <img
                            src={`/team_logos/${team.TeamName.toLowerCase()}.png`}
                            alt={team.TeamName}
                            className="w-16 h-16 mx-auto drop-shadow-xl"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                        />
                        <span>{team.TeamName}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Display the top 16 teams based on total points */}
      <div className="top-teams-table w-full">
        <div className="items-center flex flex-row justify-center font-bold font-sans md:gap-4 lg:gap-6 xl:gap-8">
            <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
            Six Invitational Teams
            </div>
        </div>
        <Table className="text-sm md:text-lg table-auto w-full">

            <TableHeader className="bg-myDarkColor">
            <TableRow>
                <TableHead className="w-[10%] text-white text-center font-bold">
                #
                </TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">
                Team
                </TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">
                Total Points
                </TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">
                    Region
                </TableHead>
            </TableRow>
            </TableHeader>

            <TableBody>
                {teams.slice(0, 16).map((team, index) => (
                <TableRow key={team.TeamName} className='font-semibold drop-shadow-xl'>
                    <TableCell className="w-[30%] text-center">
                        {index + 1}
                    </TableCell>
                    <TableCell className="w-[30%] text-center">
                        <img
                        src={`/team_logos/${team.TeamName.toLowerCase()}.png`}
                        alt={team.TeamName}
                        className="w-10 h-10 mx-auto drop-shadow-xl"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = "/team_logos/no_org.png";
                        }}
                        />
                        <span>{team.TeamName}</span>
                    </TableCell>
                    <TableCell className="w-[30%] text-center">
                        {team.TotalPoints}
                    </TableCell>
                    <TableCell className="w-[30%] text-center">
                        {team.Region}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
