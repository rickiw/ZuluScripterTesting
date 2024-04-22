/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";
import { ReplicatedStorage, Teams, TweenService as Tween } from "services";
import teams from "shared/constants/teams";
import { PlayerAdded } from "./PlayerService";

enum ActionType {
	On,
	Off,
}

const MAIN_GROUP_ID = 5182937;

const getOverhead = (character: Model) => {
	const OverheadUI = character.FindFirstChild("Head")!.WaitForChild("OverheadUI");

	const NameLabel = <TextLabel>OverheadUI.FindFirstChild("PlayerName");
	const RankLabel = <TextLabel>OverheadUI.FindFirstChild("PlayerRank");

	return { NameLabel, RankLabel };
};

@Service()
export class RankService implements OnStart, PlayerAdded {
	onStart() {
		this.initEvents();
	}

	playerAdded(player: Player) {
		this.handleRank(player);
	}

	rankUpdateEvent!: RemoteEvent;
	initEvents() {
		this.rankUpdateEvent = new Instance("RemoteEvent");
		this.rankUpdateEvent.Name = "RankUpdateEvent";
		this.rankUpdateEvent.Parent = ReplicatedStorage;
		this.rankUpdateEvent.OnServerEvent.Connect((player) => this.handleRank(player));

		Events.ItemAction.connect((p, opts) =>
			opts.name === "IdCard" ? this.onIdCard(opts.target!, <ActionType>opts.action) : undefined,
		);
	}

	handleRank(player: Player) {
		const character = player.Character ?? player.CharacterAdded.Wait()[0];
		const { RankLabel } = getOverhead(character);
		const rankInMain = player.GetRankInGroup(MAIN_GROUP_ID);

		if (rankInMain === 1) {
			const ClassD = <Team>(Teams.FindFirstChild("Class-D") ?? Teams.WaitForChild("Class-D"));

			player.Team = ClassD;
			RankLabel.Text = player.Team.Name;
			RankLabel.TextColor3 = player.Team.TeamColor.Color;

			return;
		}

		const rankInfo = player.Team ? teams[player.Team.Name as keyof typeof teams] : undefined;
		if (!rankInfo) {
			return;
		}

		const [rankColor, rankGroupId] = rankInfo;

		if (rankGroupId !== undefined) {
			RankLabel.Text = player.GetRoleInGroup(rankGroupId);
			RankLabel.TextColor3 = rankColor;
		} else {
			RankLabel.Text = player.Team!.Name;
			RankLabel.TextColor3 = player.TeamColor.Color;
		}
	}

	onIdCard(player: Player, action: ActionType) {
		const character = player.Character ?? player.CharacterAdded.Wait()[0];
		const { NameLabel, RankLabel } = getOverhead(character);

		let fadeOutTimer: thread | undefined = undefined;

		switch (action) {
			case ActionType.On: {
				if (fadeOutTimer) {
					task.cancel(fadeOutTimer);
				}

				const fadeInName = Tween.Create(NameLabel, new TweenInfo(0.5), { TextTransparency: 0 });
				const fadeInRank = Tween.Create(RankLabel, new TweenInfo(0.5), { TextTransparency: 0 });

				fadeInName.Play();
				fadeInRank.Play();

				break;
			}
			case ActionType.Off: {
				const fadeOutName = Tween.Create(NameLabel, new TweenInfo(0.5), { TextTransparency: 1 });
				const fadeOutRank = Tween.Create(RankLabel, new TweenInfo(0.5), { TextTransparency: 1 });

				fadeOutTimer = task.spawn(() => {
					task.wait(5);
					fadeOutName.Play();
					fadeOutRank.Play();
				});

				break;
			}
		}
	}
}
