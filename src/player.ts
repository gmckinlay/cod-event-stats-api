import { API } from "@stagg/callofduty";
import { WZ } from "@stagg/callofduty/lib/schema/api/mw";
import {Team} from "./team";

export class Player {

    totalKills: number = 0;
	totalDeaths: number = 0;
	totalDmg: number = 0;
	totalDmgTkn: number = 0;
    bestPosition: number = 150;
    totalWins: number = 0;
    matches: number = 0;
    kd: number = 0;
    wzMatches: WZ.Match[] = [];

    constructor(public uno:string){    }

    init(date: number, api: API) {                
        this.wzMatches = [];

        const startDate = new Date(date);
        const endDate = new Date(date + (4 * 60 * 60 * 1000));
        return api.MatchList(this.uno, 'uno', 'wz', 'mw', endDate.getTime())
            .then(matchList => {
                matchList.matches.filter(element => {			
                    return element.gameType==='wz' && element.utcStartSeconds > startDate.getTime()/1000;
                }).forEach(element => {                    
                    this.wzMatches.push(<WZ.Match>element);                    
                });
            });        
    }

    updateStats() {
        this.totalKills = 0;
        this.totalDeaths = 0;
        this.totalDmg = 0;
        this.totalDmgTkn = 0;
        this.bestPosition = 150;
        this.totalWins = 0;
        this.matches = 0;
            
        this.wzMatches.forEach((match) => {            
            this.totalKills += match.playerStats.kills;
            this.totalDeaths += match.playerStats.deaths;
            this.totalDmg += match.playerStats.damageDone;
            this.totalDmgTkn += match.playerStats.damageTaken;
            this.matches ++;
            this.kd = Math.round(((this.totalKills / this.totalDeaths) +  Number.EPSILON) * 100) / 100;

            let stats: WZ.Match.PlayerStats = <WZ.Match.PlayerStats>match.playerStats;
            if(stats.teamPlacement < this.bestPosition){
                this.bestPosition = stats.teamPlacement;
            }

            if(stats.teamPlacement === 1){
                this.totalWins++;
            }
        });
    }

    toString(): string {
        return `
        Kills: ${this.totalKills}
        Deaths: ${this.totalDeaths}
        K\\D: ${this.kd}
        Dmg: ${this.totalDmg}
        Dmg Taken: ${this.totalDmgTkn}
        Best Rank: ${this.bestPosition}
        Wins: ${this.totalWins}`;
    }

    toTableString(): string {
        return `${this.totalKills}\t${this.totalDeaths}\t${this.kd}\t${this.totalDmg}\t${this.totalDmgTkn}
        \t${this.bestPosition}\t${this.totalWins}\t${this.matches}\t${this.uno.split('#')[0]}`;
    }

    static compare(a:Player, b:Player) : number {
        
        type PlayerFields = 'totalWins' | 'totalKills' | 'totalDeaths' | 'totalDmg' | 'totalDmgTkn' | 'bestPosition' | 'uno';

        const fieldSorter = (fields:PlayerFields[]) => (a:Player, b:Player) => fields.map((o:PlayerFields) => {
            let dir = -1;

            return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
        }).reduce((p, n) => p ? p : n, 0);

        return fieldSorter(['totalWins', 'totalKills', 'totalDmg'])(a, b);
    }
}