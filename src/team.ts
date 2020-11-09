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

    totalKills: number = 0;
	totalDeaths: number = 0;
	totalDmg: number = 0;
	totalDmgTkn: number = 0;
    bestPosition: number = 150;
    totalWins: number = 0;
    totalMmatches: number = 0;
    kd: number = 0;

    constructor(public name: string){}

    addPlayer(uno:string): Player {
        const player: Player = new Player(uno);
        this.players.push(player);
        return player;
    }   
    
    updateMatches() {

        // Remove all player matches where not everyone was present
        this.players.forEach(p=>{
            p.wzMatches = p.wzMatches
            .filter((match) => {
                const playersMatches =  this.players.map((p)=>p.wzMatches);                
                return playersMatches.every((playerMatches)=> {
                    const matchIds = playerMatches.map((playerMatch)=>playerMatch.matchID);
                    return matchIds.includes(match.matchID);                   
                });
            });
        });
        
        /** 
         * Get stats for each match excluding any additional matches were a disconnect may have occurred
         * i.e. before 2nd circle closes and at least one player has less than two deatshs
         * A maximum of 4 matches will be included
        **/
        if(this.players.length && this.players[0].wzMatches.length) {
            this.players[0].wzMatches.reverse().forEach((match) => {

                const stats = this.players.flatMap((p)=> p.wzMatches.filter(m=>m.matchID===match.matchID)).map(m=>m.playerStats);
                
                if(this.players[0].wzMatches.length <= 4 || this.matches.length < 4 && stats.every(stat => !(stat.timePlayed < 630 && stat.deaths < 2))){
                    const matchKills = stats.map(s => s.kills).reduce((a,b) => a + b, 0);
                    const matchDeaths = stats.map(s => s.deaths).reduce((a,b) => a + b, 0);
                
                    this.matches.push(new Match(match.matchID,
                        match.utcStartSeconds,
                        match.mode,
                        match.player.team,
                        match.playerStats.teamPlacement,
                        matchKills,
                        matchDeaths,
                        0,
                        Math.round(((matchKills / matchDeaths) +  Number.EPSILON) * 100) / 100
                        ));
                } else {
                    this.players.forEach(p=>p.wzMatches = p.wzMatches.filter(m=>m.matchID!==match.matchID));                
                }
            });            
        }

        this.players.forEach(p => p.updateStats());
        this.players.sort(Player.compare);

        this.totalDeaths = this.players.map(p=>p.totalDeaths).reduce(((a,b)=>a+b),0);
        this.totalKills = this.players.map(p=>p.totalKills).reduce(((a,b)=>a+b),0);
        this.totalDmg = this.players.map(p=>p.totalDmg).reduce(((a,b)=>a+b),0);
        this.totalDmgTkn = this.players.map(p=>p.totalDmgTkn).reduce(((a,b)=>a+b),0);
        this.totalWins = Math.max(...this.players.map(p=>p.totalWins));
        this.kd = Math.round(((this.totalKills / this.totalDeaths) +  Number.EPSILON) * 100) / 100;
    }

    static compare(a:Team, b:Team): number {
        return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);
    }
}