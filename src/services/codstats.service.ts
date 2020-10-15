
import { API } from "@stagg/callofduty";
import { Platform } from "@stagg/callofduty/lib/normalize";
import { MW } from "@stagg/callofduty/lib/schema/api";
import { Config } from "../config";
import { MWEvent } from "../mwevent";
import { Player } from "../player";
import { Team } from "../team";


export class CodStatsService {

    private callOfDutyAPI;
    private _friends: MW.Routes.Friends | undefined;
    private _events: MWEvent[] = [];

    constructor() {
        this.callOfDutyAPI = new API();
        this._events = [];
    }

    get friends(): MW.Routes.Friends | undefined {
        return this._friends;
    }

    get events(): MWEvent[] {
        return this._events;
    }

    public init(): Promise<void>{
        return this.auth().then(()=>this.updateFriends());
    }

    public addEvent(e: MWEvent): Promise<MWEvent> {        
        const event = new MWEvent();
		event.name = e.name;
		event.date = e.date;		
        this._events.push(event);
        
        return Promise.all(e.teams.flatMap((t)=>{
            const team: Team = event.addTeam(t.name);
            return t.players.map(p => team.addPlayer(p.uno).init(event.date, this.callOfDutyAPI));
        })).then(() => {
            event.teams.sort(Team.compare);
            event.teams.forEach((team)=>team.players.sort(Player.compare));
            return event;
        });        
    }

    public getMatch(id: string){
        return this.callOfDutyAPI.MatchDetails(id, 'wz', 'mw');
    }

    private auth(): Promise<void> {             
        return this.callOfDutyAPI.Login(Config.ApiUser, Config.ApiPassword).then((value:{xsrf: string, sso: string, atkn: string}) => {
            this.callOfDutyAPI.Tokens(value);
        });	    
    }

    private updateFriends(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.callOfDutyAPI.Friends().then(res=>this._friends=res);
        });
    }

}