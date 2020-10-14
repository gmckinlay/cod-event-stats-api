import { API, Schema } from '@stagg/callofduty';
import { Player } from './player'
import { Team } from './team';
import express from 'express';
import { platform } from 'os';
import { MW } from '@stagg/callofduty/lib/schema/api';
import { MWEvent } from './mwevent';
import { eventNames } from 'process';
import { CodStatsService } from './services/codstats.service';
import 'dotenv/config';

const statService: CodStatsService = new CodStatsService();

function startExpress(){
	const port = 8080; // default port to listen
	const app = express();
	app.use(express.json())
	
	app.get( "/api/friend", (req, res) => {
		res.json(statService.friends);
	});

	app.route( "/api/match/:mId").get((req, res) => {
		statService.getMatch(req.params.mId).then(match => res.json(match));
	})

	app.get( "/api/event", ( req, res ) => {
		res.json(statService.events);
	});

	app.post( "/api/event", ( req, res ) => {
		const event: MWEvent = <MWEvent>req.body;		
		statService.addEvent(event).then((event) => res.json(event));
	});

	// start the Express server
	app.listen( port, () => {
		console.log( `server started at http://localhost:${ port }` );
	});
}

function run(){
	statService.init();
	startExpress();
}

run();
