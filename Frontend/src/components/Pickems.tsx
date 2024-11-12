import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import data from '../team_points.json'; 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Cookies from 'js-cookie';

const Pickems = () => {
    const [generatedKey, setGeneratedKey] = useState('');
    const [team0_3, setTeam0_3] = useState<string | null>(null);
    const [team3_0, setTeam3_0] = useState<string | null>(null);
    const [top8Teams, setTop8Teams] = useState<string[]>([]);
    const [bracketGames, setBracketGames] = useState<{ Game: string, team1: string, team2: string }[]>([]);
    const [twitterHandle, setTwitterHandle] = useState<string>('');
    const [points, setPoints] = useState(0);

    const finished3_0 = ["FaZe", "w7m"].sort((a,b) => a.localeCompare(b));;
    const finished0_3 = ["G2", "DK"].sort((a,b) => a.localeCompare(b));;
    const finishedtop8 = ["FaZe", "w7m", "FLCS", "BDS", "Team 5", "Team 6", "Team 7", "Team 8"].sort((a,b) => a.localeCompare(b));

    const swissPhaseStarted = true;
    const swissPhaseOver = false;
    const debug = false;


    // const HOST_URL = "http://[2605:fd00:4:1001:f816:3eff:feb8:cdcf]:8000/"
    const HOST_URL = "https://simplifiedelorepo.onrender.com/";
    // import.meta.env.VITE_HOST_URL;

    useEffect(() => {
        const storedTwitterHandle = Cookies.get('twitterHandle');
        const storedGeneratedKey = Cookies.get('generatedKey');
        const storedPicks = Cookies.get('picks');
    
        if (storedTwitterHandle) {
            setTwitterHandle(storedTwitterHandle);
        }
        
        if (storedGeneratedKey) {
            setGeneratedKey(storedGeneratedKey);
        }
    
        if (storedPicks) {
            const picks = JSON.parse(storedPicks);
            setTeam0_3(picks.team0_3 || null);
            setTeam3_0(picks.team3_0 || null);
            setTop8Teams(picks.top8teams || []); // Ensure this defaults to an empty array if not set
        }

        if (debug) {
            setTeam3_0("FOX");
            setTeam0_3("CHIEFS");
            setTop8Teams(["CAG", "SZ", "FAZE", "DK", "CHIEFS", "ELV", "BDS"]);
            setGeneratedKey("123456");
            setTwitterHandle("testuser");
        }
        
        const mockBracketData = {
            Games: [
                { Game: 'QF1', team1: finishedtop8[0], team2: finishedtop8[7] },
                { Game: 'QF2', team1: finishedtop8[1], team2: finishedtop8[6]},
                { Game: 'QF3', team1: finishedtop8[2], team2: finishedtop8[5] },
                { Game: 'QF4', team1: finishedtop8[3], team2: finishedtop8[4] },
            ],
        };
        
        setBracketGames(mockBracketData.Games);
    }, []);

    const [quarterfinalWinners, setQuarterfinalWinners] = useState(Array(4).fill(null));
    const [semifinalWinners, setSemifinalWinners] = useState(Array(2).fill(null));
    const [finalWinner, setFinalWinner] = useState<string | null>(null);
    const [_, setSelectedTeam] = useState<string | null>(null);
    const teams = data.Teams.filter(team => team.MajorFlag);    


    // Selecting a team in the quarterfinals
    const handleTeamSelectQF = (team: string, index: number) => {
        const newWinners = [...quarterfinalWinners];
        newWinners[index] = team;
        setQuarterfinalWinners(newWinners);
        setSelectedTeam(team);
        console.log(`Selected team: ${team}`);
    };

    // Selecting a team in the semifinals
    const handleTeamSelectSF = (team: string, index: number) => {
        const newWinners = [...semifinalWinners];
        newWinners[index] = team;
        setSemifinalWinners(newWinners);
        setSelectedTeam(team);
        console.log(`Selected team: ${team}`);
    }

    // Picking a team in 3-0 and 0-3 games
    const handleTeamSelection = (team: { TeamName: string }, tier: string) => {
        if (tier === '0-3') {
            setTeam0_3(team.TeamName);
        } else if (tier === '3-0') {
            setTeam3_0(team.TeamName);
        }
    };

    // Clear a team selection in the swiss phase for 0-3 and 3-0
    const clearTeamSelection = (tier: string) => {
        if (tier === '0-3') {
            setTeam0_3(null);
        } else if (tier === '3-0') {
            setTeam3_0(null);
        }
    };

    // Handle the selection of a top 8 team in Swiss phase
    const handleTop8Selection = (team: string) => {
        if (top8Teams.includes(team)) {
            setTop8Teams(top8Teams.filter(t => t !== team));
        } else if (top8Teams.length < 7) {
            setTop8Teams([...top8Teams, team]);
        }
    };

    // Clear all swiss phase picks
    const clearAllPicks = () => {
        setTeam0_3(null);
        setTeam3_0(null);
        setTop8Teams([]);
        setTwitterHandle('');
        setGeneratedKey('');
        Cookies.remove('twitterHandle');
        Cookies.remove('generatedKey');
        Cookies.remove('picks');
    };

    // Clear all playoffs picks
    const clearPlayoffsPicks = () => { 
        setQuarterfinalWinners(Array(4).fill(null));
        setSemifinalWinners(Array(2).fill(null));
        setFinalWinner(null);
        setGeneratedKey('');
        setTwitterHandle('');
        Cookies.remove('twitterHandle');
        Cookies.remove('generatedKey');
    };

    // Handle the submission of swiss phase picks to the backend
    const handleSubmitPicks = async () => {
        if (!team0_3 || !team3_0 || top8Teams.length !== 7 || !twitterHandle) {
            alert('Please fill out all fields before submitting your picks.');
            return;
        }
        
        const picks = {
            Team0_3: team0_3,
            Team3_0: team3_0,
            Top8Teams: top8Teams,
        };
        

        try {
            let generatedKey = Cookies.get('generatedKey');
            let data = null;
            if (generatedKey) {
                // If a generated key is already set, this is an update
                console.log('Updating picks:', picks);
                let response = await fetch(`${HOST_URL}pickems/${twitterHandle}-${generatedKey}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(picks),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error updating picks');
                }
                data = await response.json();
                // Alert user that their picks have been updated
                alert('Your picks have been updated!');
            } else {
                console.log('Submitting picks:', picks);
                let response = await fetch(`${HOST_URL}pickems/${twitterHandle}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(picks),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error submitting picks');
                }
                data = await response.json();
                // Alert user that their picks have been submitted
                alert('Your picks have been submitted!');
            }
    
            generatedKey = data.UserKey;

            // Save to cookies
            Cookies.set('twitterHandle', twitterHandle, { expires: 21 });
            Cookies.set('generatedKey', generatedKey || '', { expires: 21 });
            Cookies.set('picks', JSON.stringify(picks), { expires: 21 });

            // Open dialog with generated key
            setGeneratedKey(generatedKey || '');
        } catch (error) {
            console.error('Error submitting picks:', (error as Error).message);
            alert('There was an error submitting your picks. Please try again.');
        }
    };

    // Handle the submission of playoff picks to the backend
    const handlePlayoffsSubmit = async () => {
        if (!quarterfinalWinners[0]  || !quarterfinalWinners[1]  || !quarterfinalWinners[2]  || !quarterfinalWinners[3]  ||  !semifinalWinners[0] || !semifinalWinners[1] || !finalWinner || !twitterHandle) {
            alert('Please select all games.');
            return;
        }
        

        const picks = {
            Team0_3: team0_3 || '',
            Team3_0: team3_0 || '',
            Top8Teams: top8Teams || ['', '', '', '', '', '', ''],
            Quarters: quarterfinalWinners,
            Semis: semifinalWinners,
            Final: finalWinner
        };
        

        try {
            let generatedKey = Cookies.get('generatedKey');
            let data = null;
            if (generatedKey) {
                // If a generated key is already set, this is an update
                console.log('Updating picks:', picks);
                let response = await fetch(`${HOST_URL}pickems/${twitterHandle}-${generatedKey}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(picks),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error updating picks');
                }
                data = await response.json();
                // Alert user that their picks have been updated
                alert('Your picks have been updated!');
            } else {
                console.log('Submitting picks:', picks);
                let response = await fetch(`${HOST_URL}pickems/${twitterHandle}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(picks),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Error submitting picks');
                }
                data = await response.json();
                // Alert user that their picks have been submitted
                alert('Your picks have been submitted!');
            }
    
            generatedKey = data.UserKey;

            // Save to cookies
            Cookies.set('twitterHandle', twitterHandle, { expires: 21 });
            Cookies.set('generatedKey', generatedKey || '', { expires: 21 });
            Cookies.set('picks', JSON.stringify(picks), { expires: 21 });

            // Open dialog with generated key
            setGeneratedKey(generatedKey || '');
        } catch (error) {
            console.error('Error submitting picks:', (error as Error).message);
            alert('There was an error submitting your picks. Please try again.');
        }

    };

    // Retrieve picks from the backend
    const handleRetrievePicks = async () => {
        const userKeyInput = document.querySelector('input[placeholder="Enter your key here"]') as HTMLInputElement;
        const userNameInput = document.querySelector('input[placeholder="Enter the previously used username here"]') as HTMLInputElement;
        const userKey = userKeyInput.value; 
        const userName = userNameInput.value; 
        
        if (!userName || !userKey) {
            alert('Please fill out all fields before retrieving your picks.');
            return;
        }
    
        try {
            const response = await fetch(`${HOST_URL}pickems/${userName}-${userKey}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    alert('No picks found for the provided username and key.');
                } else {
                    throw new Error('Network response was not ok');
                }
                return;
            }
    
            const data = await response.json();
            setTeam0_3(data.Team0_3);
            setTeam3_0(data.Team3_0);
            if (data.Top8Teams.every((team: string) => team === 'NA')) {
                setTop8Teams([]);
            } else {
                setTop8Teams(data.Top8Teams);
            }
            setTop8Teams(data.Top8Teams);
            setSemifinalWinners(data.Semis);
            setQuarterfinalWinners(data.Quarters);
            setFinalWinner(data.Final);
            setTwitterHandle(userName);
            let generatedKey = userKey;
            setGeneratedKey(generatedKey);
            setPoints(data.Points);
            // Save to cookies
            Cookies.set('twitterHandle', userName, { expires: 21 });
            Cookies.set('generatedKey', generatedKey || '', { expires: 21 });
            Cookies.set('picks', JSON.stringify(data), { expires: 21 });
        } catch (error) {
            console.error('Error retrieving picks:', error);
            alert('There was an error retrieving your picks. Please try again.');
        }
    };
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    // Render the swiss stage pickems
    const renderSwissStage = () => {
        return (
        <div>
            <h2 className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center pt-2">Swiss Stage Pickems</h2>
            <h3 className="text-myThirdColor text-xl md:text-lg lg:text-xl text-center pb-2">(Open till end of phase 1)</h3>

            <div className="flex flex-col md:flex-row items-center bg-myColor text-myThirdColor font-sans align-middle justify-between">
                {/* Team 3-0 Selection */}
                <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-4">
                    <h3 className="text-lg font-semibold mb-2">Pick a team that will go 3-0</h3>
                    <Popover>
                        <PopoverTrigger className="btn btn-primary flex-shrink-0 py-2">
                            <img src={`/dropdown.svg`} className="w-6 h-6" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-myDarkColor drop-shadow-xl rounded-xl p-4 flex flex-col w-full">
                            <div className="grid grid-cols-3 gap-2">
                                {teams
                                    .filter(team => !top8Teams.includes(team.TeamName) && team.TeamName !== team3_0)
                                    .map(team => (
                                        <button
                                            key={team.TeamName}
                                            onClick={() => handleTeamSelection(team, '3-0')}
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
                        </PopoverContent>
                    </Popover>
                    <div className={`flex flex-col drop-shadow-lg ${team3_0 ? 'bg-myFifthColor text-black border-myDarkColor' : 'bg-myDarkColor '} p-6 rounded-xl border-none w-full mt-2`}>
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src={team3_0 ? `/team_logos/${team3_0.toLowerCase()}.png` : "/team_logos/no_org.png"}
                                alt={team3_0 || "No team selected"}
                                className="mx-auto drop-shadow-xl"
                                width="45"
                                height="45"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = "/team_logos/no_org.png";
                                }}
                            />
                            <span>{team3_0 || "No team selected"}</span>
                            {team3_0 && (
                                <button onClick={() => clearTeamSelection('3-0')} className="rounded px-8 py-2">
                                    <img src={`/clear.svg`} className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Team 0-3 Selection */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Pick a team that will go 0-3</h3>
                    <Popover>
                        <PopoverTrigger className="btn btn-primary flex-shrink-0 py-2">
                            <img src={`/dropdown.svg`} className="w-6 h-6" />
                        </PopoverTrigger>
                        <PopoverContent className="bg-myDarkColor drop-shadow-xl rounded-xl p-4 flex flex-col w-full">
                            <div className="grid grid-cols-3 gap-2">
                                {teams
                                    .filter(team => !top8Teams.includes(team.TeamName) && team.TeamName !== team0_3)
                                    .map(team => (
                                        <button
                                            key={team.TeamName}
                                            onClick={() => handleTeamSelection(team, '0-3')}
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
                        </PopoverContent>
                    </Popover>
                    <div className={`flex flex-col drop-shadow-lg ${team0_3 ? 'bg-myFourthColor text-black border-myDarkColor' : 'bg-myDarkColor border-myThirdColor'} p-6 rounded-xl border-none w-full mt-2`}>
                        <div className="flex flex-col items-center gap-2">
                            <img
                                src={team0_3 ? `/team_logos/${team0_3.toLowerCase()}.png` : "/team_logos/no_org.png"}
                                alt={team0_3 || "No team selected"}
                                className="mx-auto drop-shadow-xl"
                                width="45"
                                height="45"
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.src = "/team_logos/no_org.png";
                                }}
                            />
                            <span>{team0_3 || "No team selected"}</span>
                            {team0_3 && (
                                <button onClick={() => clearTeamSelection('0-3')} className="rounded px-8 py-2">
                                    <img src={`/clear.svg`} className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl p-2">The remaining 7 teams will advance</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {teams
                        .filter(team => team.TeamName !== team0_3 && team.TeamName !== team3_0)
                        .map(team => (
                            <div key={team.TeamName} className="p-4">
                                <button
                                    onClick={() => handleTop8Selection(team.TeamName)}
                                    className={`border-none drop-shadow-2xl rounded-xl p-6 w-full h-32 ${top8Teams.includes(team.TeamName) ? 'bg-myFifthColor text-myDarkColor' : 'bg-myDarkColor text-myThirdColor'}`}
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
                                    {team.TeamName}
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* Twitter Handle Input and Action Buttons */}
            <div className="flex flex-col mt-4 items-center justify-center ">
                <input
                    type="text"
                    placeholder="Enter a username here (Reddit or Twitter etc.)"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
                />
                <div className="flex flex-row items-center justify-center gap-4 mt-4">
                    {generatedKey && (
                        <h2 className="text-myThirdColor text-lg md:text-xl lg:text-xl text-center p-2">
                            Your code is {generatedKey}. <br /> Save this code to retrieve your picks later.
                        </h2>
                    )}
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-4 mt-4 pb-4"> 
                <button
                    onClick={handleSubmitPicks}
                    className="bg-mySecondaryColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                >
                    {generatedKey ? 'Update Picks': 'Submit Picks'}
                </button>
                <button
                    onClick={() => clearAllPicks()} 
                    className="bg-myFourthColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                >
                    Clear Picks 
                </button>
            </div>

            <hr className="w-full my-4 border-t-2 border-myThirdColor" />
        </div>
    )};

    // Render the results of the swiss stage
    const renderFinishedSwissStage = () => {
        return(
        <div>
            {!swissPhaseOver && swissPhaseStarted ? <h2 className="text-2xl font-semibold">Retrieve picks to see Swiss Stage Picks</h2>  : <h2 className="text-2xl font-semibold">Swiss Stage is still ongoing</h2>}
            <h2 className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center pt-2">Swiss Stage Pickems</h2>
                <h2 className="text-myThirdColor font-semibold text-2xl md:text-xl lg:text-2xl text-center p-2">Points: {points}</h2>

            <div className="flex flex-col md:flex-row items-center bg-myColor text-myThirdColor font-sans align-middle justify-center">
                {/* Team 3-0 */}
                <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-4">
                    <h3 className="text-lg font-semibold mt-2">3-0 teams</h3>
                    <div className={`flex flex-col items-center gap-2 p-6 rounded-t-xl w-32 ${team3_0 === finished3_0[0] ? 'bg-mySecondaryColor' : 'bg-myDarkColor'}`}>
                        <img
                            src={`/team_logos/${finished3_0[0].toLowerCase()}.png`}
                            alt={`${finished3_0[0]}`}
                            className="mx-auto drop-shadow-xl"
                            width="45"
                            height="45"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                        />
                        <span>{finished3_0[0]|| "No team selected"}</span>
                    </div>
                    <div className={`flex flex-col items-center gap-2 p-6 rounded-b-xl w-32 ${team3_0 === finished3_0[1] ? 'bg-mySecondaryColor' : 'bg-myDarkColor'}`}>
                        <img
                            src={`/team_logos/${finished3_0[1].toLowerCase()}.png`}
                            alt={`${finished3_0[1]}`}
                            className="mx-auto drop-shadow-xl"
                            width="45"
                            height="45"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                        />
                        {finished3_0[1]}
                    </div>
                </div>

                {/* Team 0-3 */}
                <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-4 ">
                    <h3 className="text-lg font-semibold mt-2">0-3 teams</h3>
                    <div className={`flex flex-col items-center gap-2 p-6 rounded-t-xl w-32 ${team0_3 === finished0_3[0] ? 'bg-mySecondaryColor' : 'bg-myDarkColor'}`}>
                        <img
                            src={`/team_logos/${finished0_3[0].toLowerCase()}.png`}
                            alt={`${finished0_3[0]}`}
                            className="mx-auto drop-shadow-xl"
                            width="45"
                            height="45"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                        />
                        <span>{finished0_3[0]|| "No team selected"}</span>
                    </div>
                    <div className={`flex flex-col items-center gap-2 p-6 rounded-b-xl w-32 ${team0_3 === finished0_3[1] ? 'bg-mySecondaryColor' : 'bg-myDarkColor'}`}>
                        <img
                            src={`/team_logos/${finished0_3[1].toLowerCase()}.png`}
                            alt={`${finished0_3[1]}`}
                            className="mx-auto drop-shadow-xl"
                            width="45"
                            height="45"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/team_logos/no_org.png";
                            }}
                        />
                        {finished0_3[1]}
                    </div>
                </div>      
            </div>

            {/* Top 8 teams */}
            <div className="m-4">
                <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl p-2">Top 8 teams</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {finishedtop8
                        .map((team,index) => (
                            <div key={`${team} ${index}`} className={`p-4 rounded-xl items-center text-center w-full h-fit ${(top8Teams.includes(team) || team == team3_0) && generatedKey ? 'bg-mySecondaryColor text-myDarkColor' : 'bg-myDarkColor text-myThirdColor'}`}>
                                <img
                                    src={`/team_logos/${team.toLowerCase()}.png`}
                                    alt={team}
                                    className="mx-auto drop-shadow-xl"
                                    width="45"
                                    height="45"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = "/team_logos/no_org.png";
                                    }}
                                />
                                {team}
                            </div>
                        ))}
                </div>

                {generatedKey && (
                    <div>
                        {!(team3_0 && team0_3) || top8Teams[0] == "NA1" ? 
                            <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl p-2 pt-4">You didn't make any picks in Swiss</h3>
                            : ( 
                                <div>
                                    <div className="flex flex-col items-center justify-center gap-4 p-4">
                                    <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl ">Your picks </h3>
                                    <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl ">Username: {twitterHandle} </h3>
                                    <h3 className="text-lg font-semibold text-center text-myThirdColor md:text-xl lg:text-2xl ">Code: {generatedKey} </h3>
                                    </div>
                                    <div className="flex flex-row items-center justify-center gap-4 pb-4">
                                        <div className={`flex flex-col items-center gap-2 p-6 rounded-xl w-32 ${team3_0 in finished3_0 ? 'bg-myDarkColor' : 'bg-myFourthColor text-black'}`}>
                                            <span>3-0 Team</span>
                                            <img
                                                src={`/team_logos/${team3_0.toLowerCase()}.png`}
                                                alt={`${team3_0}`}
                                                className="mx-auto drop-shadow-xl"
                                                width="45"
                                                height="45"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/team_logos/no_org.png";
                                                }}
                                            />
                                            <span>{team3_0 || "No team picked"}</span>
                                        </div>
                                        <div className={`flex flex-col items-center gap-2 p-6 rounded-xl w-32 ${team0_3 in finished0_3 ? 'bg-myDarkColor' : 'bg-myFourthColor text-black'}`}>
                                            <span>0-3 Team</span>
                                            <img
                                                src={`/team_logos/${team0_3.toLowerCase()}.png`}
                                                alt={`${team0_3}`}
                                                className="mx-auto drop-shadow-xl"
                                                width="45"
                                                height="45"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/team_logos/no_org.png";
                                                }}
                                            />
                                            <span>{team0_3 || "No team picked"}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {top8Teams
                                            .filter(team => !finishedtop8.includes(team))
                                            .map(team => (
                                                <div key={team} className={`p-4 rounded-xl items-center text-center ${top8Teams.includes(team) || finished3_0.includes(team) ? 'bg-myFourthColor text-myDarkColor' : 'bg- text-myThirdColor'}`}>
                                                    <img
                                                        src={`/team_logos/${team.toLowerCase()}.png`}
                                                        alt={team}
                                                        className="mx-auto drop-shadow-xl"
                                                        width="45"
                                                        height="45"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/team_logos/no_org.png";
                                                        }}
                                                    />
                                                    {team}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>

            <hr className="w-full my-4 border-t-2 border-myThirdColor" />

        </div>

        
    )};
    
    // Render the playoffs bracket
    const renderBracket = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="overflow-x-auto w-full">
                    <div className="flex flex-row justify-center items-center gap-16">
                        {/* Quarterfinals */}
                        <div key="Quarter" className="flex flex-col items-center mx-4 gap-2">
                            {bracketGames.slice(0, 4).map((game, index) => (
                                <div>
                                    <div key={`${index}1`} className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-t-xl drop-shadow-xl ${quarterfinalWinners[index] === game.team1 ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                        <button
                                            className='flex items-center w-full justify-center'
                                            onClick={() => game.team1 && handleTeamSelectQF(game.team1, index)}
                                        >
                                            <img src={`/team_logos/${game.team1.toLowerCase()}.png`} alt={game.team1} className="w-8 h-8 mr-2" onError={(e) => { e.currentTarget.src = "/team_logos/no_org.png"; }} />
                                            <span>{game.team1}</span>
                                        </button>
                                    </div>
                                    <hr className="w-full border-t-2 border-myThirdColor justify-center" />
                                    <div key={`${index}2`}  className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-b-xl drop-shadow-xl ${quarterfinalWinners[index] === game.team2 ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                        <button
                                            className='flex items-center w-full justify-center'
                                            onClick={() => handleTeamSelectQF(game.team2, index)}
                                        >
                                            <img src={`/team_logos/${game.team2.toLowerCase()}.png`} alt={game.team2} className="w-8 h-8 mr-2" onError={(e) => { e.currentTarget.src = "/team_logos/no_org.png"; }} />
                                            <span>{game.team2}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex flex-col items-center mx-4 gap-28">
                            {/* SF1 */}
                            <div>
                                <div key="SF1" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-t-xl drop-shadow-xl ${semifinalWinners[0] === quarterfinalWinners[0] && semifinalWinners[0] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[0], 0)}>
                                        <img src={`/team_logos/${quarterfinalWinners[0] ? quarterfinalWinners[0].toLowerCase() : 'no_org'}.png`} alt="Winner QF1" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[0] ? quarterfinalWinners[0] : 'QF1'}</span>
                                    </button>
                                </div>
                                <hr className="w-full border-t-2 border-myThirdColor" />
                                <div key="SF2" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-b-xl drop-shadow-xl ${semifinalWinners[0] === quarterfinalWinners[1] && semifinalWinners[0] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[1], 0)}>
                                        <img src={`/team_logos/${quarterfinalWinners[1] ? quarterfinalWinners[1].toLowerCase() : 'no_org'}.png`} alt="Winner QF2" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[1] ? quarterfinalWinners[1] : 'QF2'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* SF2 */}
                            <div>
                                <div key="SF3" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-t-xl drop-shadow-xl ${semifinalWinners[1] === quarterfinalWinners[2] && semifinalWinners[1] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[2], 1)}>
                                        <img src={`/team_logos/${quarterfinalWinners[2] ? quarterfinalWinners[2].toLowerCase() : 'no_org'}.png`} alt="Winner QF3" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[2] ? quarterfinalWinners[2] : 'QF3'}</span>
                                    </button>
                                </div>
                                <hr className="w-full border-t-2 border-myThirdColor" />
                                <div key="SF4" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-b-xl drop-shadow-xl ${semifinalWinners[1] === quarterfinalWinners[3] && semifinalWinners[1] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[3], 1)}>
                                        <img src={`/team_logos/${quarterfinalWinners[3] ? quarterfinalWinners[3].toLowerCase() : 'no_org'}.png`} alt="Winner QF4" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[3] ? quarterfinalWinners[3] : 'QF4'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Finals */}
                        <div className="flex flex-col items-center mx-4">
                            <div>
                                <div key="FINAL1" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-t-xl drop-shadow-xl ${finalWinner === semifinalWinners[0] && finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' onClick={() => setFinalWinner(semifinalWinners[0])}>
                                        <img src={`/team_logos/${semifinalWinners[0] ? semifinalWinners[0].toLowerCase() : 'no_org'}.png`} alt="Winner SF1" className="w-8 h-8 mr-2" />
                                        <span>{semifinalWinners[0] ? semifinalWinners[0] : 'SF1'}</span>
                                    </button>
                                </div>
                                <hr className="w-full border-t-2 border-myThirdColor" />
                                <div key="FINAL2" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-b-xl drop-shadow-xl ${finalWinner === semifinalWinners[1] && finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' onClick={() => setFinalWinner(semifinalWinners[1])}>
                                        <img src={`/team_logos/${semifinalWinners[1] ? semifinalWinners[1].toLowerCase() : 'no_org'}.png`} alt="Winner SF2" className="w-8 h-8 mr-2" />
                                        <span>{semifinalWinners[1] ? semifinalWinners[1] : 'SF2'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Winner */}
                        <div className="flex flex-col items-center mx-4 bg-myDarkColor rounded-xl">
                            <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center p-2">Winner: </h2>
                            <div key="WINNER" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-b-xl  drop-shadow-xl ${finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                <button className="flex items-center">
                                    <img src={`/team_logos/${finalWinner ? finalWinner.toLowerCase() : 'no_org'}.png`} alt="Pick" className="w-8 h-8 mr-2" />
                                    <span>{finalWinner ? finalWinner : 'Finish bracket'}</span>
                                </button>
                            </div>
                        </div>

                    </div>    

                    <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center pt-2">If you did swiss stage pickems, retrieve your picks first, else just enter a username</h2>
                    
                    <div className="flex flex-col mt-4 w-full items-center justify-center ">
                        <input
                            type="text"
                            placeholder="Enter a username here (Reddit or Twitter etc.)"
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value)}
                            className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
                        />
                        <div className="flex flex-row items-center justify-center gap-4 mt-4">
                            {generatedKey && (
                                <h2 className="text-myThirdColor text-lg md:text-xl lg:text-xl text-center p-2">
                                    Your code is {generatedKey}. <br /> Save this code to retrieve your picks later.
                                </h2>
                            )}
                        </div>
                    </div>

                    
                    <div className="flex flex-row items-center justify-center gap-4 pb-4"> 
                        <button
                            onClick={handlePlayoffsSubmit}
                            className="bg-mySecondaryColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                        >
                            {generatedKey ? 'Update Playoffs Picks': 'Submit Playoffs Picks'}
                        </button>
                        <button
                            onClick={() => clearPlayoffsPicks()} 
                            className="bg-myFourthColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                        >
                            Clear Picks 
                        </button>
                    </div>
                </div>
                <hr className="w-full my-4 border-t-2 border-myThirdColor" />
                
            </div>       

        );
    };

    // Render the playoffs bracket in mobile
    const renderMobileBracket = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="overflow-x-auto w-full">
                    <div className="flex flex-col justify-center items-center gap-4">
                        {/* Quarterfinals */}
                        <div key="Quarter" className="flex flex-col items-center mx-4 gap-2 mt-4">
                            <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center p-2">Quarterfinals</h2>
                            {bracketGames.slice(0, 4).map((game, index) => (
                                <div className="flex flex-row ">
                                    <div key={`${index}1`} className={`game flex flex-row items-center border-none p-2 w-40 gap-2 rounded-l-xl drop-shadow-xl ${quarterfinalWinners[index] === game.team1 ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                        <button
                                            className='flex items-center w-full justify-center'
                                            onClick={() => game.team1 && handleTeamSelectQF(game.team1, index)}
                                        >
                                            <img src={`/team_logos/${game.team1.toLowerCase()}.png`} alt={game.team1} className="w-8 h-8 mr-2" onError={(e) => { e.currentTarget.src = "/team_logos/no_org.png"; }} />
                                            <span>{game.team1}</span>
                                        </button>
                                    </div>
                                    <div key={`${index}2`}  className={`game flex flex-row items-center p-2 w-40 gap-2 rounded-r-xl drop-shadow-xl ${quarterfinalWinners[index] === game.team2 ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                        <button
                                            className='flex items-center w-full justify-center'
                                            onClick={() => handleTeamSelectQF(game.team2, index)}
                                        >
                                            <img src={`/team_logos/${game.team2.toLowerCase()}.png`} alt={game.team2} className="w-8 h-8 mr-2" onError={(e) => { e.currentTarget.src = "/team_logos/no_org.png"; }} />
                                            <span>{game.team2}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Semifinals */}
                        <div className="flex flex-col items-center mx-4 gap-2 mt-4">
                            {/* SF1 */}
                            <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center p-2">Semifinals</h2>
                            <div className="flex flex-row items-center">
                                <div key="SF1" className={`game flex flex-row items-center border-none p-2 w-40 gap-2 rounded-l-xl drop-shadow-xl ${semifinalWinners[0] === quarterfinalWinners[0] && semifinalWinners[0] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[0], 0)}>
                                        <img src={`/team_logos/${quarterfinalWinners[0] ? quarterfinalWinners[0].toLowerCase() : 'no_org'}.png`} alt="Winner QF1" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[0] ? quarterfinalWinners[0] : 'QF1'}</span>
                                    </button>
                                </div>
                                <div key="SF2" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-r-xl drop-shadow-xl ${semifinalWinners[0] === quarterfinalWinners[1] && semifinalWinners[0] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[1], 0)}>
                                        <img src={`/team_logos/${quarterfinalWinners[1] ? quarterfinalWinners[1].toLowerCase() : 'no_org'}.png`} alt="Winner QF2" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[1] ? quarterfinalWinners[1] : 'QF2'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* SF2 */}
                            <div className="flex flex-row items-center">
                                <div key="SF3" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-l-xl drop-shadow-xl ${semifinalWinners[1] === quarterfinalWinners[2] && semifinalWinners[1] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[2], 1)}>
                                        <img src={`/team_logos/${quarterfinalWinners[2] ? quarterfinalWinners[2].toLowerCase() : 'no_org'}.png`} alt="Winner QF3" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[2] ? quarterfinalWinners[2] : 'QF3'}</span>
                                    </button>
                                </div>
                                <div key="SF4" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-r-xl drop-shadow-xl ${semifinalWinners[1] === quarterfinalWinners[3] && semifinalWinners[1] ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' 
                                            onClick={() => handleTeamSelectSF(quarterfinalWinners[3], 1)}>
                                        <img src={`/team_logos/${quarterfinalWinners[3] ? quarterfinalWinners[3].toLowerCase() : 'no_org'}.png`} alt="Winner QF4" className="w-8 h-8 mr-2" />
                                        <span>{quarterfinalWinners[3] ? quarterfinalWinners[3] : 'QF4'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Finals */}
                        <div className="flex flex-col items-center mx-4 gap-2 mt-4">
                            <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center p-2">Finals</h2>
                            <div className="flex flex-row">
                                <div key="FINAL1" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-l-xl drop-shadow-xl ${finalWinner === semifinalWinners[0] && finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' onClick={() => setFinalWinner(semifinalWinners[0])}>
                                        <img src={`/team_logos/${semifinalWinners[0] ? semifinalWinners[0].toLowerCase() : 'no_org'}.png`} alt="Winner SF1" className="w-8 h-8 mr-2" />
                                        <span>{semifinalWinners[0] ? semifinalWinners[0] : 'SF1'}</span>
                                    </button>
                                </div>
                                <div key="FINAL2" className={`game flex flex-col items-center border-none p-2 w-40 gap-2 rounded-r-xl drop-shadow-xl ${finalWinner === semifinalWinners[1] && finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                                    <button className='flex items-center w-full justify-center' onClick={() => setFinalWinner(semifinalWinners[1])}>
                                        <img src={`/team_logos/${semifinalWinners[1] ? semifinalWinners[1].toLowerCase() : 'no_org'}.png`} alt="Winner SF2" className="w-8 h-8 mr-2" />
                                        <span>{semifinalWinners[1] ? semifinalWinners[1] : 'SF2'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Winner */}
                        <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center pt-2">Winner</h2>
                        <div key="WINNER" className={`game flex flex-col items-center border-none p-2 w-40 rounded-xl  drop-shadow-xl ${finalWinner ? 'bg-myFifthColor' : 'bg-myDarkColor'}`}>
                            <button className="flex items-center">
                                <img src={`/team_logos/${finalWinner ? finalWinner.toLowerCase() : 'no_org'}.png`} alt="Pick" className="w-8 h-8 mr-2" />
                                <span>{finalWinner ? finalWinner : 'Finish bracket'}</span>
                            </button>
                        </div>


                    </div>    

                    <h2 className="text-myThirdColor text-lg md:text-lg lg:text-lg text-center pt-2">If you did swiss stage pickems, retrieve your picks first, else just enter a username</h2>
                    
                    <div className="flex flex-col mt-4 w-full items-center justify-center ">
                        <input
                            type="text"
                            placeholder="Enter a username here (Reddit or Twitter etc.)"
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value)}
                            className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
                        />
                        <div className="flex flex-row items-center justify-center gap-4 mt-4">
                            {generatedKey && (
                                <h2 className="text-myThirdColor text-lg md:text-xl lg:text-xl text-center p-2">
                                    Your code is {generatedKey}. <br /> Save this code to retrieve your picks later.
                                </h2>
                            )}
                        </div>
                    </div>

                    
                    <div className="flex flex-row items-center justify-center gap-4 pb-4"> 
                        <button
                            onClick={handlePlayoffsSubmit}
                            className="bg-mySecondaryColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                        >
                            {generatedKey ? 'Update Playoffs Picks': 'Submit Playoffs Picks'}
                        </button>
                        <button
                            onClick={() => clearPlayoffsPicks()} 
                            className="bg-myFourthColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                        >
                            Clear Picks 
                        </button>
                    </div>
                </div>
                <hr className="w-full my-4 border-t-2 border-myThirdColor" />
            </div>
        );
    };

    // Render retrieve section 
    const renderRetrive = () => {
        return (
        <div>
            <h2 className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center p-2 pb-8">If you've already submitted pickems, retrieve them using your username and key</h2>
            <div className="flex flex-col items-center justify-center gap-y-4">
                <input
                    type="text"
                    placeholder="Enter the previously used username here"
                    className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
                />
    
                <input
                    type="text"
                    placeholder="Enter your key here"
                    className="px-4 py-2 mb-2 rounded drop-shadow-md w-full md:w-1/2 bg-myThirdColor text-myDarkColor font-semibold"
                />
    
                <button
                    onClick={handleRetrievePicks}
                    className="bg-mySecondaryColor text-black px-4 py-2 rounded drop-shadow-xl font-semibold"
                >
                    Retrieve Picks
                </button>
            </div>
            <hr className="w-full my-4 border-t-2 border-myThirdColor" />

        </div>);
    };


    return (
        <div className="justify-center font-bold font-sans md:gap-4 lg:gap-6 xl:gap-8 pb-2">
            <div className="items-center justify-center gap-4 text-center">
                {!swissPhaseStarted ? (
                    renderSwissStage()
                 ) : swissPhaseStarted && swissPhaseOver ? (
                    <h2 className="text-2xl font-semibold"></h2>
                ) : swissPhaseStarted ? (
                    renderFinishedSwissStage()
                ) : ( <div/> )}
            </div>
            {/* <h2 className="text-2xl font-semibold">Scroll down below to see your Swiss Stage picks<hr className="w-full my-4 border-t-2 border-myThirdColor" /></h2> */}

            <h3 className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center p-2">Playoffs Bracket</h3>
            <div className="flex flex-col items-center justify-center gap-y-4">
                {swissPhaseOver && bracketGames.length > 0 
                    ? (isMobile ? renderMobileBracket() : renderBracket())
                    : <p className="text-myThirdColor text-lg md:text-xl lg:text-xl text-center w-full p-2">Loading bracket...<hr className="w-full my-4 border-t-2 border-myThirdColor" /></p>}
            </div>

            {renderRetrive()}

            <div className="items-center justify-center text-center gap-4">
                {swissPhaseOver ? renderFinishedSwissStage() : <div/>}
            </div>
            
            <h6 className="text-myThirdColor text-lg md:text-sm lg:text-lg text-center p-2">For any issues or queries, please reach out @ the link below. <br />
            Created by {""}
            <a href="https://x.com/ItzAxon" className="text-myFifthColor underline">Axon</a></h6>
        </div>
    );
}

export default Pickems;
