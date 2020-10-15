import { Player } from "./player";
import { Team } from "./team";

export class MWEvent {
    name: string = '';
    teams: Team[] = [];
    date: number= 0;

    public addTeam(name: string): Team{
        const team: Team = new Team(name);
        this.teams.push(team);
        return team;
    }    
}