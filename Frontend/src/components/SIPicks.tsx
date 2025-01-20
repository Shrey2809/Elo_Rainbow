"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Example teams grouped by group
const groups: { [key: string]: string[] } = {
  "Group A": ["Unwanted", "Team Liquid", "M80", "Team Joel", "G2 Esports"],
  "Group B": ["FaZe Clan", "Team Secret",  "FURIA Esports", "Shopify Rebellion", "CAG Osaka"],
  "Group C": ["Team BDS", "DarkZero Esports", "Team Falcons" , "PSG Talon", "RazaH Company Academy"],
  "Group D": ["w7m esports", "Virtus.pro", "Spacestation Gaming", "SCARZ", "Oxygen Esports"],
};

// Tiers
const tiers = ["1st Seed", "2nd Seed", "3rd Seed", "4th Seed", "Eliminated"];

const logoMap: { [key: string]: string } = {
  "G2 Esports": "g2.png",
  "M80": "m80.png",
  "Team Joel": "bleed.png",
  "Team Liquid": "liquid.png",
  "Unwanted": "c9bc.png",
  "CAG Osaka": "cag.png",
  "FaZe Clan": "faze.png",
  "FURIA Esports": "furia.png",
  "Shopify Rebellion": "sr.png",
  "Team Secret": "secret.png",
  "DarkZero Esports": "dz.png",
  "PSG Talon": "psg.png",
  "RazaH Company Academy": "e1.png",
  "Team BDS": "bds.png",
  "Team Falcons": "flcs.png",
  "Oxygen Esports": "oxg.png",
  "Spacestation Gaming": "ssg.png",
  "SCARZ": "sz.png",
  "Virtus.pro": "vp.png",
  "w7m esports": "w7m.png",
};

export default function TierListMaker() {
  const [selections, setSelections] = useState<{ [key: string]: { [key: string]: string } }>(() => {
    return Object.keys(groups).reduce((acc: { [key: string]: { [key: string]: string } }, group) => {
      acc[group] = tiers.reduce((tierAcc: { [key: string]: string }, tier) => {
        tierAcc[tier] = ""; // Single team per tier
        return tierAcc;
      }, {});
      return acc;
    }, {});
  });

  const handleTeamChange = (group: string, tier: string, team: string) => {
    setSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      updatedSelections[group][tier] = team;
      return updatedSelections;
    });
  };

  const handleClearPicks = (group: string) => {
    setSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      Object.keys(updatedSelections[group]).forEach((tier) => {
        updatedSelections[group][tier] = "";
      });
      return updatedSelections;
    });
  };

  const primaryColorMap: { [key: string]: string } = {
    "G2 Esports": "#570b0d",
    "M80": "#141A20",
    "Team Joel": "#173304",
    "Team Liquid": "#001538",
    "Unwanted": "#000000",
    "CAG Osaka": "#231815",
    "FaZe Clan": "#010f54",
    "FURIA Esports": "#000000",
    "Shopify Rebellion": "#2F2F2F",
    "Team Secret": "#000000",
    "DarkZero Esports": "#240238",
    "PSG Talon": "#004170",
    "RazaH Company Academy": "#7a4801",
    "Team BDS": "#043482",
    "Team Falcons": "#005732",
    "Oxygen Esports": "#0e4f36",
    "Spacestation Gaming": "#222222",
    "SCARZ": "#590d0d",
    "Virtus.pro": "#571b00",
    "w7m esports": "#700122",
    "": "#2F3037",
  };
  
  const getPrimaryColor = (team: string) => {
    return primaryColorMap[team] || "#000000"; // Default to black if no color is defined
  };

  return (
    <div className="tier-list-container w-full bg-myColor p-8 items-center">
      <div className="bg-myColor text-white p-4 rounded-2xl w-full">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">SI 2025 Pick'ems</h1>
        </div>
      </div>

      {/* Responsive Group Container */}
      <div className="flex flex-col sm:flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {Object.keys(groups).map((group) => (
          <div className="flex flex-col items-center">
            <div
              key={group}
              className="group-container mt-8 w-full sm:w-fit bg-myDarkColor p-4 text-center rounded-3xl"
            >
              <h2 className="text-2xl font-bold text-myThirdColor">{group}</h2>
              <div className="all-teams mt-4">
                <div className="flex flex-row justify-center gap-4 bg-mySecondCellColor rounded-3xl">
                  {groups[group].map((team) => (
                    <div key={team} className="p-2 rounded-md text-white">
                      <img
                        src={`/team_logos/${logoMap[team]}`}
                        alt={`${team} logo`}
                        className="inline-block w-8 h-8 mr-2 md:w-12 md:h-12 drop-shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                {tiers.map((tier) => (
                  <div
                    key={tier}
                    className="tier-card bg-mySecondCellColor p-4 rounded-3xl overflow-hidden"
                    style={{
                      backgroundColor: getPrimaryColor(selections[group][tier]), // Add tint dynamically
                      opacity: 0.9, // Slight transparency for tint
                    }}
                  >
                    <h3
                      className={`text-xl font-semibold drop-shadow-lg ${
                        selections[group][tier] ? "text-myThirdColor" : "text-myThirdColor"
                      }`}
                    >
                      {tier}
                    </h3>

                    {selections[group][tier] ? (
                      <div className="relative flex items-center justify-center ">
                        <img
                          src={`/team_logos/${logoMap[selections[group][tier]]}`}
                          alt={`${selections[group][tier]} background logo`}
                          className="absolute w-32 h-32 opacity-20 blur-sm" // Adjust size, opacity, and blur for the background effect
                        />
                        <img
                          src={`/team_logos/${logoMap[selections[group][tier]]}`}
                          alt={`${selections[group][tier]} logo`}
                          className="relative w-12 h-12" // Foreground is smaller and sharp
                        />
                      </div>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="mt-2 bg-myFifthColor text-myDarkColor font-bold px-4 py-2 rounded-2xl">
                            Pick
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-mySecondCellColor p-4 rounded-2xl">
                          <div className="flex flex-col space-y-2">
                            {groups[group].map((team) => (
                              <button
                                key={team}
                                onClick={() =>
                                  handleTeamChange(group, tier, team)
                                }
                                className="text-white px-4 py-2 rounded-xl hover:bg-mySecondaryColor w-full"
                                disabled={Object.values(selections[group]).includes(
                                  team
                                )}
                              >
                                <img
                                  src={`/team_logos/${logoMap[team]}`}
                                  alt={`${team} logo`}
                                  className="inline-block w-12 h-12 mr-2 drop-shadow-xl"
                                />
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>

            
            </div>
            <div>
              <button
              onClick={() => handleClearPicks(group)}
              className="mt-4 bg-myFourthColor text-black font-bold px-4 py-2 rounded-2xl"
              >
                Clear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
