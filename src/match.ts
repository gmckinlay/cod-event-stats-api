import { Killstreak } from "@stagg/callofduty/lib/schema";

export class Match {

    constructor (
        public matchId: string,
        public startTime: number,
        public mode: string,
        public team: string,
        public position: number,
        public totalKills: number,
        public totalDeaths:number,
        public score: number,
        public kd: number){}
}