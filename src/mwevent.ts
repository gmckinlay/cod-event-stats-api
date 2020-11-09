import { Player } from "./player";
import { Team } from "./team";
import { Match } from "./match"

export class MWEvent {
    name: string = '';
    teams: Team[] = [];
    date: number= 0;
    games: {team:Team, match: Match}[][] = [];

    public addTeam(name: string): Team{
        const team: Team = new Team(name);
        this.teams.push(team);
        return team;
    }    

    public updateScores(){

        this.teams.forEach((team)=>team.updateMatches());                     
        
        this.games = [];

        this.teams.forEach(t=>{
            t.score = 0;
            for(let i=0; i<Math.max(...this.teams.map(t=>t.matches.length)); i++){
                if(t.matches[i]) {
                    if(!this.games[i]){
                        this.games[i] = [];
                    }                    
                    this.games[i].push({team: t, match: t.matches[i]});
                }
            }
        });

        this.games.forEach(g=> {            
            const sorted = g.slice().sort((a,b) => (a.match.position < b.match.position ? -1 : ((a.match.position > b.match.position ? 1 : 0)))).map(i=>i.match.position);
            const ranks = g.map(v => sorted.indexOf(v.match.position) + 1);            
            g.forEach((game) => {
                game.match.score = this.getGameScore(game.team, game.match.totalKills, ranks[g.map(g=>g.match.position).indexOf(game.match.position)]);                           
                game.team.score += game.match.score;                     
            });
        });

        this.games.forEach(g=>g.sort((a, b) => (a.match.score < b.match.score) ? 1 : ((b.match.score < a.match.score) ? -1 : 0)));        
        this.teams.sort(Team.compare);     
    }

    private getGameScore(team: Team, kills: number, position: number): number {
        let score = 0;             
        score += position < 15 ? 300 - ((position-1) *15) : 0;
        score += kills * 10;    
        return score;
    }
}