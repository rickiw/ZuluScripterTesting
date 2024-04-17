import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { GroupService, Players, UserInputService } from "@rbxts/services";
import { Functions } from "client/network";
import { BaseActions, HandlesMultipleInputs, MultipleInput } from "./BaseInput";

const actions = [
	{ input: [Enum.KeyCode.O, Enum.KeyCode.ButtonA], action: "CreateClan" },
	{ input: [Enum.KeyCode.Z], action: "ViewAllClans" },
	{ input: [Enum.KeyCode.P], action: "DepositFunds" },
	{ input: [Enum.KeyCode.LeftBracket], action: "WithdrawFunds" },
] as const satisfies MultipleInput;
type ClanActions = BaseActions<typeof actions>;

const player = Players.LocalPlayer;

@Controller()
export class ClanController extends HandlesMultipleInputs<ClanActions> implements OnStart {
	inputs = actions;

	onStart() {
		UserInputService.InputEnded.Connect((input, processed) => {
			if (processed) {
				return;
			}
			const action = this.hasInput(input.KeyCode);
			if (!action) {
				return;
			}
			switch (action) {
				case "CreateClan":
					this.createClan();
					break;
				case "ViewAllClans":
					this.getClans();
					break;
				case "DepositFunds":
					this.depositFunds(1);
					break;
				case "WithdrawFunds":
					this.withdrawFunds(1);
					break;
			}
		});
	}

	withdrawFunds(amount: number) {
		const result = Functions.WithdrawClanFunds.invoke(amount).expect();
		switch (result) {
			case "Error":
				Log.Warn("An error occurred while withdrawing funds");
				break;
			case "InsufficientBalance":
				Log.Warn(
					"Player {@Player} tried to withdraw {@Amount} but the clan has insufficient balance",
					player.Name,
					amount,
				);
				break;
			case "NotAllowed":
				Log.Warn("Player {@Player} tried to withdraw {@Amount} but isn't allowed", player.Name, amount);
				break;
			case "NotInClan":
				Log.Warn("Player {@Player} tried to withdraw {@Amount} but isn't in a clan", player.Name, amount);
				break;
			case "Success":
				Log.Warn("Player {@Player} successfully withdrew {@Amount}", player.Name, amount);
				break;
		}
	}

	depositFunds(amount: number) {
		const result = Functions.DepositClanFunds.invoke(amount).expect();
		switch (result) {
			case "Error":
				Log.Warn("An error occurred while depositing funds");
				break;
			case "InsufficientBalance":
				Log.Warn(
					"Player {@Player} tried to deposit {@Amount} but has insufficient balance",
					player.Name,
					amount,
				);
				break;
			case "NotInClan":
				Log.Warn("Player {@Player} tried to deposit {@Amount} but isn't in a clan", player.Name, amount);
				break;
			case "Success":
				Log.Warn("Player {@Player} successfully deposited {@Amount}", player.Name, amount);
				break;
		}
	}

	getClans() {
		const clans = Functions.GetClans.invoke().expect();
		Log.Info("Clans: {@Clans}", clans);
	}

	createClan() {
		const groups = GroupService.GetGroupsAsync(player.UserId);
		const ownedGroup = groups.find((group) => {
			const groupInfo = GroupService.GetGroupInfoAsync(group.Id);
			return groupInfo.Owner.Id === player.UserId;
		});
		if (!ownedGroup) {
			Log.Warn("Player {@Player} does not own a group", player);
			return;
		}
		const result = Functions.CreateClan.invoke(ownedGroup.Id).expect();
		switch (result) {
			case "AlreadyExists":
				Log.Warn("Clan with ID {@ID} already exists", ownedGroup.Id);
				break;
			case "AlreadyInClan":
				Log.Warn("Player {@Player} is already in a clan", player.Name);
				break;
			case "Error":
				Log.Warn("An error occurred while creating clan");
				break;
			case "NotAllowed":
				Log.Warn("Player {@Player} tried to create clan but isn't owner of the group", player.Name);
				break;
			case "Success":
				Log.Warn("Player {@Player} successfully created clan {@ClanName}", player.Name, ownedGroup.Name);
				break;
		}
	}
}
