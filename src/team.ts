import { API } from "@stagg/callofduty";
import { platform } from "os";
import { Player } from "./player";
import { Match } from "./match"

export class Team {
    private static WIN_MULTI = 300;
    private static KILL_MULTI = 10;

    players: Player[] = [];
    matches: Match[] = [];
    score: number = 0;

    constructor(public name: string){}

    addPlayer(uno:string): Player {
        const player: Player = new Player(uno);
        this.players.push(player);
        return player;
    }   
    
    updateMatches() {
        if(this.players.length && this.players[0].wzMatches.length) {
            this.players[0].wzMatches.reverse().forEach((match) => {

                const stats = this.players.flatMap((p)=> p.wzMatches.filter(m=>m.matchID===match.matchID)).map(m=>m.playerStats);
                const matchKills = stats.map(s => s.kills).reduce((a,b) => a + b, 0);
                const matchDeaths = stats.map(s => s.deaths).reduce((a,b) => a + b, 0);

                if(this.players[0].wzMatches.length <= 4 || this.matches.length < 4 && stats.every(stat => !(stat.timePlayed < 630 && stat.deaths < 2))){
                    this.matches.push(new Match(match.matchID,
                        match.utcStartSeconds,
                        match.mode,
                        match.player.team,
                        match.playerStats.teamPlacement,
                        matchKills,
                        matchDeaths
                        ));
                }
            });
        }
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