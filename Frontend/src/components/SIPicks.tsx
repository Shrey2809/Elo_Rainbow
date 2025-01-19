"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// Example teams grouped by group
const groups: { [key: string]: string[] } = {
  "Group A": ["G2 Esports", "M80", "Team Joel", "Team Liquid", "Unwanted"],
  "Group B": ["CAG Osaka", "FaZe Clan", "FURIA Esports", "Shopify Rebellion", "Team Secret"],
  "Group C": ["DarkZero Esports", "PSG Talon", "RazaH Company Academy", "Team BDS", "Team Falcons"],
  "Group D": ["Oxygen Esports", "Spacestation Gaming", "SCARZ", "Virtus.pro", "w7m esports"],
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

  return (
    <div className="tier-list-container w-full bg-myColor p-8 items-center">
      <div className="bg-myColor text-white p-4 rounded-2xl w-full ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">SI 2025 Pick'ems</h1>
          <p>Select the teams you think will place in each seed</p>
        </div>
      </div>

      <div className="flex flex-col-2 items-center justify-center gap-16 ">
        {Object.keys(groups).map((group) => (
          <div key={group} className="group-container mt-8 w-fit bg-myDarkColor p-4 text-center rounded-3xl">
            <h2 className="text-2xl font-bold text-myThirdColor ">{group}</h2>
            <div className="all-teams mt-4">
              <div className="flex flex-row justify-center gap-4 bg-mySecondCellColor rounded-3xl">
                {groups[group].map((team) => (
                  <div key={team} className="p-2 rounded-md text-white">
                    <img
                      src={`/team_logos/${logoMap[team]}`}
                      alt={`${team} logo`}
                      className="inline-block w-12 h-12 mr-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {tiers.map((tier) => (
                <div key={tier} className="tier-card bg-mySecondCellColor p-4 rounded-3xl">
                  <h3 className="text-xl font-semibold text-white">{tier}</h3>
                  {selections[group][tier] ? (
                    <div className="rounded-md text-white flex items-center justify-center">
                      <img
                        src={`/team_logos/${logoMap[selections[group][tier]]}`}
                        alt={`${selections[group][tier]} logo`}
                        className="w-12 h-12"
                      />
                    </div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="mt-2 bg-myFifthColor text-myDarkColor font-bold px-4 py-2 rounded-2xl">
                          Pick Team
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-mySecondCellColor p-4 rounded-2xl">
                        <div className="flex flex-col space-y-2">
                          {groups[group].map((team) => (
                            <button
                              key={team}
                              onClick={() => handleTeamChange(group, tier, team)}
                              className="text-white px-4 py-2 rounded-xl hover:bg-mySecondaryColor w-full"
                              disabled={Object.values(selections[group]).includes(team)}
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

            <button
              onClick={() => handleClearPicks(group)}
              className="mt-4 bg-red-500 text-white font-bold px-4 py-2 rounded-2xl hover:bg-red-600"
            >
              Clear Picks
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
