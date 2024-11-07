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

type TempFormat = {
  Rank: number;
  TeamName: string;
  Probability: number;
  FinishRequired: string;
}



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

const qualifiedTeams = transformedData.filter((team) => team.percentage === 1);
const notQualifiedTeams = transformedData.filter((team) => team.percentage !== 1 && team.finishRequired !== 'none');
const teamsNotAtMajor = transformedData.filter((team) => team.finishRequired === 'none' && team.percentage !== 1);

// Your timestamp from JSON
let timestamp = mergedData.Date; 

// Parse the string into a Date object
let date = new Date(timestamp + " UTC");

// Get the user's local timezone
let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Convert and display the date in the user's timezone
let userDate = date.toLocaleString('en-US', { timeZone: userTimezone, month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
let timezoneAbbreviation = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2];

// Format userDate to match the structure
let formattedDate = userDate.replace(',', '');


export default function SIProbabilites() {   
  return (
    <div className="w-full">
      {/* Display last calculation date and average minimum points */}
      <div className="items-center flex flex-row justify-center font-normal font-sans md:gap-4 lg:gap-6 xl:gap-8">
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Avg Min Points <br/><b>{Math.round(mergedData.MinPoints / 5) * 5}</b>
        </div>
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Last updated <br/><b>{formattedDate} {timezoneAbbreviation}</b>
        </div>
        <div className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center  p-2  ">
          Simulations <br/><b>1 million runs</b>
        </div>
      </div>

      {/* Table displaying team probabilities */}
      <hr className="border-myThirdColor border-2 w-11/12 mx-auto my-4" />
      <div className="text-sm md:text-lg w-full my-4">
        {/* Table body with team data */}
        <h2 className="text-white text-2xl pb-4 text-center font-bold my-4">Qualified Teams</h2>
        <div className="flex flex-row flex-wrap gap-8 w-full h-full items-center justify-center" >
          {qualifiedTeams.map((data) => {
            return (
              <div className="text-black font-semifold drop-shadow-xl flex flex-col items-center w-32 rounded-3xl gap-2 p-4 bg-mySecondaryColor">
                <div className="text-center">
                  <img
                    src={`/team_logos/${data.team.toLowerCase()}.png`}
                    alt={data.team}
                    className="w-10 h-10 mx-auto drop-shadow-xl"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/team_logos/no_org.png";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <hr className="border-myThirdColor border-2 w-11/12 mx-auto my-4" />
        {/* Table body with team data */}
        <h2 className="text-white text-2xl text-center font-bold my-4">Teams At Montreal</h2>
        <h2 className="text-white text-xl pb-4 text-center font-bold">(Finish for 300+ Points Below Teams)</h2>
        <div className="flex flex-row flex-wrap gap-8 w-full h-full items-center justify-center" >
          {notQualifiedTeams.map((data) => {
            return (
              <React.Fragment key={data.rank}>
                <div className="text-white font-semifold drop-shadow-xl flex flex-col items-center w-32 rounded-3xl gap-2 p-4 bg-myDarkColor">
                  <div className="text-center">
                    <img
                      src={`/team_logos/${data.team.toLowerCase()}.png`}
                      alt={data.team}
                      className="w-10 h-10 mx-auto drop-shadow-xl"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/team_logos/no_org.png";
                      }}
                    />
                  </div>
                    <div className="text-lg font-bold">
                      {(Math.floor(data.percentage * 100 * 100) / 100).toFixed(2)}%
                    </div>
                  <div className="font-semibold">
                    {data.rank < (bleedRank ?? Infinity) ? (
                      <span className="text-mySecondaryColor">Cleared</span>
                    ) : data.finishRequired !== 'none' ? (
                      `${data.finishRequired}`
                    ) : (
                      <span className="text-myFourthColor">NQ</span>
                    ) }
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <hr className="border-myThirdColor border-2 w-11/12 mx-auto my-4" />
        {/* Table body with team data */}
        <h2 className="text-white text-2xl pb-4 text-center font-bold my-4">Teams Missing Montreal</h2>
        <div className="flex flex-row flex-wrap gap-8 w-full h-full items-center justify-center" >
          {teamsNotAtMajor.map((data) => {
            return (
              <React.Fragment key={data.rank}>
                <div className="text-white font-semifold drop-shadow-xl flex flex-col items-center w-32 rounded-3xl gap-2 p-4 bg-myDarkColor">
                  <div className="text-center">
                    <img
                      src={`/team_logos/${data.team.toLowerCase()}.png`}
                      alt={data.team}
                      className="w-10 h-10 mx-auto drop-shadow-xl"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/team_logos/no_org.png";
                      }}
                    />
                  </div>
                    <div className="text-lg font-bold">
                      {(Math.floor(data.percentage * 100 * 100) / 100).toFixed(2)}%
                    </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="text-white text-xl p-4 text-center mt-4">
          Matchups data and logos provided by Liquipedia. Created by {""}
          <a href="https://x.com/ItzAxon" className="text-myFourthColor underline">Axon</a>
        </div>

      </div>
    </div>
  );
}
