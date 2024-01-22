
import { Cartesian3 } from 'cesium'
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