"use client";
import { useState } from "react";
import teamPoints from "../team_points.json"; // Import your JSON
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Your tiers and points data
const tiers = [
  "1st",
  "2nd",
  "3rd-4th",
  "5th-8th",
  "9th-11th",
  "12th-14th",
  "15th-16th",
  "17th-20th",
];

const points: Record<string, number> = {
  "1st": 350,
  "2nd": 260,
  "3rd-4th": 200,
  "5th-8th": 170,
  "9th-11th": 105,
  "12th-14th": 65,
  "15th-16th": 55,
  "17th-20th": 45,
  "Teams": 0,
};

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
  Major1Series: number;
  Major1Maps: number;
}


const maxTeamsPerTier: Record<string, number> = {
  "1st": 1,
  "2nd": 1,
  "3rd-4th": 2,
  "5th-8th": 4,
  "9th-11th": 3,
  "12th-14th": 3,
  "15th-16th": 2,
  "17th-20th": 4,
};

// Adjusted calculateTotalPoints function
const calculateTotalPoints = (teams: Team[], tierTeams: Record<string, Team[]>): Team[] => {
    const updatedTeams = teams.map((team) => {
      const tier = Object.keys(tierTeams).find((key) => tierTeams[key].includes(team));
      const tierPoints = tier ? points[tier] : 0; // Get points based on the tier or 0 if not found
      return {
        ...team,
        TotalPoints: team.Stage1Points + team.Major1Points + team.Stage2Points + tierPoints,
        Tier: tier || "Teams",
      };
    });
  
    return updatedTeams.sort((a, b) => {
      if (b.TotalPoints !== a.TotalPoints) {
        return b.TotalPoints - a.TotalPoints;
      }
  
      // Continue with existing sorting logic
      if (b.TotalPoints - (b.Stage1Points + b.Stage2Points) !== a.TotalPoints - (a.Stage1Points + a.Stage2Points)) {
        return (b.TotalPoints - (b.Stage1Points + b.Stage2Points)) - (a.TotalPoints - (a.Stage1Points + a.Stage2Points));
      }
  
      if (b.Major1Series !== a.Major1Series) {
        return b.Major1Series - a.Major1Series;
      }
  
      return b.Major1Maps - a.Major1Maps;
    });
  };
  
  export default function TierListMaker() {
    const [teams, setTeams] = useState<Team[]>(teamPoints.Teams);
    const [topTeams, setTopTeams] = useState<Team[]>([]);
    const [tierTeams, setTierTeams] = useState<Record<string, Team[]>>({
      "1st": [],
      "2nd": [],
      "3rd-4th": [],
      "5th-8th": [],
      "9th-11th": [],
      "12th-14th": [],
      "15th-16th": [],
      "17th-20th": [],
    });


  
    const handleTeamSelection = (team: Team, tier: string) => {
      const updatedTierTeams = { ...tierTeams };
      
      // Remove team from its current tier if applicable
      Object.keys(updatedTierTeams).forEach((t) => {
        updatedTierTeams[t] = updatedTierTeams[t].filter((t) => t.TeamName !== team.TeamName);
      });
    
      // Check if the selected tier has reached its limit
      if (updatedTierTeams[tier].length < maxTeamsPerTier[tier]) {
        updatedTierTeams[tier].push(team);
        setTierTeams(updatedTierTeams);
      } else {
        // Optionally, alert the user that the tier is full
        alert(`Cannot add ${team.TeamName} to ${tier}. The tier is already full.`);
      }
    };
    
  
    const handleCalculate = () => {
      const calculatedTeams = calculateTotalPoints(teams, tierTeams); // Pass tierTeams here
      setTeams(calculatedTeams);
      setTopTeams(calculatedTeams.slice(0, 20));
    };

     // Function to clear teams from a specific tier
    const handleClearTier = (tier: string) => {
      const updatedTierTeams = { ...tierTeams };
      updatedTierTeams[tier] = [];
      setTierTeams(updatedTierTeams);
    };
  
    return (
      <div className="tier-list-container w-full">
        <div className="tier-list-grid text-myThirdColor ">
          <div className="items-center flex flex-row justify-center font-bold font-sans md:gap-4 lg:gap-6 xl:gap-8 pb-2">
          <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
            Pick your teams, then hit calculate to see the 16 teams that would qualify for SI2025!
          </div>
          </div>
          <Table>
            <TableCaption className="text-myThirdColor font-semibold text-center">
              <div className="pagination p-4  items-center align-middle">
                <button
                  onClick={handleCalculate}
                  className="px-8 py-4 bg-mySecondaryColor text-black rounded-xl text-lg"
                >
                  Calculate
                </button>
              </div>
            </TableCaption>
            {tiers.map((tier) => (
              <div key={tier} className="tier-row border-spacing-3 border-2 border-myThirdColor text-xl font-semibold flex items-center">
                <TableCell className="w-[10%] md:w-[10%] text-xl font-semibold border-r-4 h-20 border-myThirdColor text-center bg-myDarkColor">
                  {tier}
                </TableCell>
                <TableCell className="w-[10%] md:w-[5%]">
                  <Popover>
                    <PopoverTrigger className="btn btn-primary flex-shrink-0 min-w-[48px] align-middle">
                      <img src={`/dropdown.svg`} className="w-6 h-6" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-myDarkColor drop-shadow-xl rounded-xl p-4 flex flex-row w-full">
                      <div className="grid grid-col-1 justify-center items-center align-middle">
                        <div className="grid grid-cols-4 gap-4">
                          {teams
                            .filter((team) => team.MajorFlag && !Object.values(tierTeams).flat().includes(team)) 
                            .map((team) => (
                              <button
                                key={team.TeamName}
                                onClick={() => handleTeamSelection(team, tier)}
                                className="cursor-pointer py-2"
                              >
                                <img
                                  src={`/team_logos/${team.TeamName.toLowerCase()}.png`}
                                  alt={team.TeamName}
                                  className="mx-auto drop-shadow-xl"
                                  width="45"
                                  height="45"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.src = "/team_logos/no_org.png";
                                  }}
                                />
                              </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setTierTeams({
                              "1st": [],
                              "2nd": [],
                              "3rd-4th": [],
                              "5th-8th": [],
                              "9th-11th": [],
                              "12th-14th": [],
                              "15th-16th": [],
                              "17th-20th": [],
                            })}
                            className="px-8 py-2 w-fit bg-myFourthColor text-black rounded-xl text-lg font-semibold "
                          >
                            Reset All
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="w-[80%] md:w-[80%]">
                  <div className="team-items flex flex-wrap justify-start gap-4">
                    {tierTeams[tier].map((team) => (
                      <div key={team.TeamName} className="team-item sub font-semibold drop-shadow-xl text-center align-middle">
                        <img
                          src={`/team_logos/${team.TeamName.toLowerCase()}.png`}
                          alt={team.TeamName}
                          className="mx-auto drop-shadow-xl"
                          width="45"
                          height="45"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/team_logos/no_org.png";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="w-[5%] md:w-[5%]">
                <button
                  onClick={() => handleClearTier(tier)}
                  className="btn btn-primary flex-shrink-0 min-w-[48px] align-middle justify-end"
                >
                  <img src={`/clear.svg`} className="w-6 h-6" />
                </button>
                </TableCell>
              </div>
            ))}
          </Table>
        </div>
  
        {/* Table showing top teams */}
        <div className="top-teams-table w-full pt-8">
          <Table className="text-sm md:text-lg table-auto w-full">
            <TableCaption className="text-myThirdColor font-semibold text-center text-lg p-4">
              Top 16 Teams (Hit calculate to see pre-major rankings)
              <br/>
            </TableCaption>
            <TableHeader className="bg-myDarkColor">
              <TableRow>
                <TableHead className="w-[10%] text-white text-center font-bold">#</TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">Team</TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">Total Points</TableHead>
                <TableHead className="w-[30%] text-white text-center font-bold">Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topTeams.map((team, index) => (
                <>
                  <TableRow key={team.TeamName} className="font-semibold drop-shadow-xl">
                    <TableCell className="w-[10%] text-center">{index + 1}</TableCell>
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
                    <TableCell className="w-[30%] text-center">{team.TotalPoints}</TableCell>
                    <TableCell className="w-[30%] text-center">{team.Region}</TableCell>
                  </TableRow>

                  {index === 15 && (
                    <TableRow key={`break-${index}`} className="h-2">
                      <TableCell colSpan={4} className="bg-myDarkColor text-center font-semibold p-2 text-white">
                        The above teams would qualify for SI (For any ties, consider Liquipedia for tiebreakers)
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </div> 
    );
  }
  