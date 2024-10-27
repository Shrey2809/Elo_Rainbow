import { useState, useEffect } from 'react';
import data from '../team_points.json'; 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Cookies from 'js-cookie';

const Pickems = () => {
    const [generatedKey, setGeneratedKey] = useState('');
    const [team0_3, setTeam0_3] = useState<string | null>(null);
    const [team3_0, setTeam3_0] = useState<string | null>(null);
    const [top8Teams, setTop8Teams] = useState<string[]>([]);
    
    const [twitterHandle, setTwitterHandle] = useState<string>('');
    const HOST_URL = import.meta.env.VITE_HOST_URL;

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
    }, []);

    

    const teams = data.Teams.filter(team => team.MajorFlag);


    const handleTeamSelection = (team: { TeamName: string }, tier: string) => {
        if (tier === '0-3') {
            setTeam0_3(team.TeamName);
        } else if (tier === '3-0') {
            setTeam3_0(team.TeamName);
        }
    };

    const clearTeamSelection = (tier: string) => {
        if (tier === '0-3') {
            setTeam0_3(null);
        } else if (tier === '3-0') {
            setTeam3_0(null);
        }
    };

    const handleTop8Selection = (team: string) => {
        if (top8Teams.includes(team)) {
            setTop8Teams(top8Teams.filter(t => t !== team));
        } else if (top8Teams.length < 7) {
            setTop8Teams([...top8Teams, team]);
        }
    };

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

    const handleRetrievePicks = async () => {
        const userKeyInput = document.querySelector('input[placeholder="Enter your key here"]') as HTMLInputElement;
        const userNameInput = document.querySelector('input[placeholder="Enter the previously used username here"]') as HTMLInputElement;
        const userKey = userKeyInput.value; 
        const twitterHandle = userNameInput.value; 
        
        if (!twitterHandle || !userKey) {
            alert('Please fill out all fields before retrieving your picks.');
            return;
        }
    
        try {
            const response = await fetch(`${HOST_URL}pickems/${twitterHandle}-${userKey}`);
            
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
            setTop8Teams(data.Top8Teams);
            setTwitterHandle(twitterHandle);
            setGeneratedKey(userKey);
        } catch (error) {
            console.error('Error retrieving picks:', error);
            alert('There was an error retrieving your picks. Please try again.');
        }
    };
    
    return (
        <div className="justify-center font-bold font-sans md:gap-4 lg:gap-6 xl:gap-8 pb-2">
            <h2 className="text-myThirdColor text-2xl md:text-xl lg:text-2xl text-center p-2">Swiss Stage Pickems</h2>
    
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
                    <div className={`flex flex-col drop-shadow-lg ${team3_0 ? 'bg-myFifthColor text-black border-myDarkColor' : 'bg-myDarkColor border-myThirdColor'} p-6 rounded-xl border-2 w-full mt-2`}>
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
                    <div className={`flex flex-col drop-shadow-lg ${team0_3 ? 'bg-myFourthColor text-black border-myDarkColor' : 'bg-myDarkColor border-myThirdColor'} p-6 rounded-xl border-2 w-full mt-2`}>
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
                <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                    {teams
                        .filter(team => team.TeamName !== team0_3 && team.TeamName !== team3_0)
                        .map(team => (
                            <div key={team.TeamName} className="p-4">
                                <button
                                    onClick={() => handleTop8Selection(team.TeamName)}
                                    className={`border-none drop-shadow-2xl rounded p-6 w-full h-32 ${top8Teams.includes(team.TeamName) ? 'bg-myFifthColor text-myDarkColor' : 'bg-myDarkColor text-myThirdColor'}`}
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
        </div>
    );
}

export default Pickems;
