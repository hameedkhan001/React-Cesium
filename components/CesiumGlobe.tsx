import React, {useEffect, useRef} from "react";
import {Cartesian3, Color} from 'cesium'
import {useState} from 'react';
import {Entity, Viewer} from 'resium'
// @ts-ignore
// @ts-ignore
import cscWithId from '../components/cscWithId.json'
import {promises as fs} from 'fs';
import * as Cesium from "cesium";


interface City {
    id: number;
    name: string;
    longitude: string;
    latitude: string;
}

interface State {
    id: number;
    name: string;
    cities: City[];
}

interface Game {
    id: number;
    state: number | null;
    country: number;
    name: string;
}

interface PlayerData {
    [key: number]: number;
}


interface Data {
    games: Game[];
    players: PlayerData;
}

interface CesiumGlobeProps {
    playerCountByCity: number;
    gameNameWithCity: string;
    playerLocation: Cartesian3;
    showAllGames: boolean;
}

const CITY_ZOOM_THRESHOLD =10;
const CesiumGlobe: React.FC<CesiumGlobeProps> = ({
                                                     playerCountByCity,
                                                     gameNameWithCity,
                                                     playerLocation,
                                                     showAllGames
                                                 }) => {
    // @ts-ignore
    const cscWithId: any = import ('../components/cscWithId.json');
    const [flag, setFlag] = useState(false);
    const [cities, setCities] = useState<City[]>([]);

    const viewerRef = useRef(null);
    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [zoomLevel, setZoomLevel] = useState<'city' | 'state'>('state');

    // Fetch city data from "cscWithId.json"
    useEffect(() => {
        const fetchData = async () => {
            try {
                // @ts-ignore
                cscWithId.then((rows) => {

                    try {
                        // @ts-ignore
                        setCities(() => (Object.values(rows)))
                    } catch (e) {

                    }

                    // @ts-ignore
                }).catch((e) => {

                })
            } catch (error) {
                console.error('Error fetching city data', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {

        if (!viewer) return;

        console.log('zoom')
        // Add an event listener to handle zoom changes
        const zoomChangeHandler = () => {
            const currentZoomLevel = viewer.camera.getMagnitude(); // Get the current zoom level

            console.log(currentZoomLevel,'currentZoomLevel')
            // Set the zoom level based on a threshold (you might need to adjust this threshold)
            if (currentZoomLevel < CITY_ZOOM_THRESHOLD && zoomLevel !== 'city') {
                setZoomLevel('city');
            } else if (currentZoomLevel >= CITY_ZOOM_THRESHOLD && zoomLevel !== 'state') {
                setZoomLevel('state');
            }
        };

        // Add the event listener
        viewer.camera.moveEnd.addEventListener(zoomChangeHandler);

        // Clean up the event listener when the component is unmounted
        return () => {
            viewer.camera.moveEnd.removeEventListener(zoomChangeHandler);
        };
    }, [viewerRef, zoomLevel]);

    const defaultEntity = (
        <Entity
            name="Default Location"
            position={Cartesian3.fromDegrees(0, 0, 0)}
            point={{pixelSize: 20, color: Color.BLUE}}
            description="Default location description"
        />
    );

    const renderCityEntities = () => {
        const stateGamesCount = {};
        const countryPlayerCount = {};
        const statePlayerCount = {};
        const game_data = (localStorage.getItem('game_data') !== null && localStorage.getItem('game_data') !== undefined) ? JSON.parse(localStorage.getItem('game_data')) : {};


        const games = game_data.games;
        const players = game_data.players;
        cities !== undefined && cities.length > 0 && cities.map((country) => {
            stateGamesCount[country.id] = 0;
            country?.states?.map((state, si) => {
                const stateId = state.id;
                let stateGames = games.filter((game) => {
                    return game.state === stateId
                })
                if (stateGames.length > 0) {
                    stateGamesCount[country.id] = stateGamesCount[country.id] || [];
                    stateGames.map((gameObject) => {
                        stateGamesCount[country.id].push({
                            gameName: gameObject.name
                        });
                    })
                }
                state.cities.map((citiess, ci) => {
                    const cityId = citiess.id;
                    if (players[cityId]) {
                        countryPlayerCount[country.id] = (countryPlayerCount[country.id] || 0) + players[cityId];
                        statePlayerCount[cityId] = (statePlayerCount[cityId] || 0) + players[cityId];
                    }
                });
            });
        });

        return cities !== undefined && cities.length > 0 && cities.map((country) => {

            return (

                <Entity
                    key={country.id}
                    name={country.name}
                    position={Cartesian3.fromDegrees(
                        parseFloat(country.longitude ?? 0 as string),
                        parseFloat(country.latitude ?? 0 as string),
                        100
                    )}
                    point={{pixelSize: 20, color: Color.WHITE}}
                    description={
                        `
                    Player Count : ${countryPlayerCount[country.id] ?? 0} <br/>
                Game Name : ${gameArrayToString(stateGamesCount[country.id] || [])} <br/>
                
                ${zoomLevel ==='city' ?getPlayerCount():''}
                        `
                    }
                    onClick={() => setFlag((f) => !f)}
                />
            )

        });
    };


    const getPlayerCount = ()=> {
        return 'Player Count:0'
    }
    const gameArrayToString = (arr = []) => {
        let str = '';
        arr.map((row, index) => {
            if (((arr.length - 1) - index) === 0) {
                str += `${row.gameName}`;
            } else {
                str += `${row.gameName},`;
            }
        })
        return str ?str:'N/A';
    }


    return (
        <Viewer
            full
            ref={viewerRef}
            onViewerLoaded={(viewer) => {

                setViewer(viewer)
            }}
        >
            {renderCityEntities()}
            {flag && (
                <Entity
                    position={playerLocation}
                    point={{pixelSize: 20, color: Color.RED}}
                />
            )}
            {!flag && defaultEntity}
        </Viewer>
    );
};
// Example usage:


const getGameData = async () => {
    // @ts-ignore
    const data: any = import ('../components/data.json');

    data.then((rows) => {
        return rows;
    })
    return [];
}
const ExampleComponent: React.FC = () => {

    // @ts-ignore
    const data: any = import ('../components/data.json');

    // Fetch game and player data from "data.json"
    const [gameData, setGameData] = useState<Data | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // @ts-ignore
                //const response = await fetch('data.json');
                // @ts-ignore
                /* const file = await fs.readFile(data);*/

                // @ts-ignore
                data.then((rows) => {
                    setGameData(() => (rows))
                    localStorage.setItem('game_data', JSON.stringify(rows))
                })


            } catch (error) {
                console.error('Error fetching game and player data', error);
            }
        };
        fetchData();
    }, []);

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const {
        games,
        players,
    }: { games: Game[]; players: PlayerData } = gameData;

    // Customize based on your logic to get player count, game name, player location, and showAllGames
    const playerCountByCity = 10;
    const gameNameWithCity = 'Game 1';
    const playerLocation = Cartesian3.fromDegrees(0, 0, 100);
    const showAllGames = true;

    return (
        <CesiumGlobe
            playerCountByCity={playerCountByCity}
            gameNameWithCity={gameNameWithCity}
            playerLocation={playerLocation}
            showAllGames={showAllGames}
        />
    );
};

export default ExampleComponent;