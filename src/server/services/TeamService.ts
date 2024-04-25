/* eslint-disable curly */
import { OnStart, Service } from "@flamework/core";
import { ReplicatedStorage, Teams, Workspace } from "@rbxts/services";
import { Functions } from "server/network";
import { serverStore } from "server/store";
import teams from "shared/constants/teams";
import { PlayerAdded } from "./PlayerService";
import { RankService } from "./RankService";

const escapedTeam = Teams.FindFirstChild("Escaped Class-D") as Team;

@Service()
export class TeamService implements OnStart, PlayerAdded {
	onStart() {
		Functions.JoinTeam.setCallback((player, team) => {
			serverStore.setPlayerTeam(player, team);
			return true;
		});

		this.initEvents();
		this.onEscapedClassD();
		this.makeTeams();
	}

	playerAdded(player: Player) {
		player.GetPropertyChangedSignal("Team").Connect(() => {
			this.rankService.handleRank(player);
		});

		serverStore.setPlayerTeam(player, "FP");
	}

	escapedEvent!: RemoteEvent;
	initEvents() {
		this.escapedEvent = new Instance("RemoteEvent");
		this.escapedEvent.Name = "Escaped Class-D";
		this.escapedEvent.Parent = ReplicatedStorage;
	}

	makeTeams() {
		for (const [TeamName, [TeamColor]] of pairs(teams)) {
			const TeamObj = new Instance("Team");
			TeamObj.AutoAssignable = false;
			TeamObj.Name = TeamName;
			TeamObj.TeamColor = new BrickColor(TeamColor);
			TeamObj.Parent = Teams;
		}
	}

	onEscapedClassD() {
		const cache = new Set<string>();

		const onTouchedEscapeTrigger = (object: BasePart) => {
			const players = game.GetService("Players");

			if (!object.Parent?.FindFirstChild("Humanoid")) return;
			const player = players.GetPlayerFromCharacter(object.Parent);

			if (!player || !escapedTeam) return;
			if (player.Team?.Name !== "Class-D") return;
			if (cache.has(player.Name)) return;

			cache.add(player.Name);

			player.TeamColor = escapedTeam.TeamColor;
			player.Team = escapedTeam;

			this.escapedEvent.FireClient(player);

			wait(5);
			cache.delete(player.Name);
		};

		const trigger = Workspace.WaitForChild("Escape Trigger") as Part;
		trigger.Touched.Connect((...args) => onTouchedEscapeTrigger(...args));
	}

	constructor(private readonly rankService: RankService) {}
}
