import { API } from "@stagg/callofduty";
import { platform } from "os";
import { Player } from "./player";

export class Team {
    private static WIN_MULTI = 300;
    private static KILL_MULTI = 10;

    players: Player[] = [];

    constructor(public name: string){}

    addPlayer(uno:string): Player {
        const player: Player = new Player(uno);
        this.players.push(player);
        return player;
    }   
    
    getScrore(): number {
        const wins = Math.max.apply(Math, this.players.map(o => o.totalWins));
        const kills = this.players.map(p=>p.totalKills).reduce((a,b) => a + b, 0);

        return wins* Team.WIN_MULTI + kills * Team.KILL_MULTI;
    }

    static compare(a:Team, b:Team): number {
        return (a.getScrore() < b.getScrore()) ? 1 : ((b.getScrore() < a.getScrore()) ? -1 : 0);
    }
}