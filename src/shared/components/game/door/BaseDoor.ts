import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import Octree from "@rbxts/octo-tree";
import { Motion, SpringOptions, createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import type { SimNodeInfo, SimulationController } from "client/controllers/SimulationController";
import { springs } from "shared/constants/springs";
import { BaseInteraction } from "../BaseInteraction";
import { BasePresence } from "../BasePresence";
import { DoorSound } from "./DoorSound";

export interface DoorInstance extends Model {
	Cards: Folder;
}

export interface Door {
	onMotorStep(value: number): void;
	onDoorInteract(player: Player): void;
}

export interface BaseDoorAttributes {
	locked?: boolean;
	broken?: boolean;
	autoClose?: boolean;
	autoCloseDelay?: number;
	open?: boolean;
	moving?: boolean;
}

export interface DoorAttributes extends BaseDoorAttributes {
	canInterrupt?: boolean;
	spring?: SpringOptions;
}

export interface BaseDoorInstance extends Model {
	Cards: Folder;
	Center: BasePart;
}

@Component({
	defaults: {
		locked: false,
		broken: false,
		autoCloseDelay: 2,
		open: false,
		moving: false,
		canInterrupt: true,
	},
})
export class BaseDoor<A extends DoorAttributes, I extends DoorInstance> extends BaseComponent<A, I> implements OnStart {
	maid = new Maid();
	baseMotor: Motion;
	validCards: string[];
	originCF: CFrame;
	interactComponents: BaseInteraction<any, any>[];
	presenceComponents: BasePresence<any, any>[];
	interacted: Signal<(player: Player) => void>;
	authenticated: Signal<(player: Player, authenticated: boolean) => void>;
	stateChanged: Signal<(open: boolean) => void>;
	open: boolean;
	openMotor: number;
	closeMotor: number;
	doorSound?: DoorSound<any, any>;
	springSettings: SpringOptions;
	simNode?: Octree.Node<SimNodeInfo>;
	isSimulated: boolean;

	constructor() {
		super();

		this.baseMotor = createMotion(0, { start: true });
		this.validCards = [];
		this.originCF = new CFrame();
		this.interactComponents = [];
		this.presenceComponents = [];
		this.interacted = new Signal();
		this.authenticated = new Signal();
		this.stateChanged = new Signal();

		this.open = false;

		this.openMotor = 1;
		this.closeMotor = 0;
		this.springSettings = springs.world;

		this.isSimulated = false;

		this.maid.GiveTask(this.interacted);
		this.maid.GiveTask(this.stateChanged);
		this.maid.GiveTask(this.authenticated);
	}

	onInteract(player: Player) {
		const authorized = this.authenticatePlayer(player);
		this.authenticated.Fire(player, authorized);
		if (authorized) {
			this.sendInteractionMessage(player, "interaction_accepted");
			this.setReaderColor(Color3.fromRGB(0, 255, 0));
			if (this.doorSound) this.doorSound.doorAccept();
			this.interacted.Fire(player);
		} else {
			this.sendInteractionMessage(player, "interaction_denied");
			this.setReaderColor(Color3.fromRGB(255, 0, 0));
			if (this.doorSound) this.doorSound.doorDeny();
			Log.Verbose("Player {@Player} was not authenticated for door {@Door}", player.Name, this.instance.Name);
		}
		task.delay(0.4, () => {
			this.setReaderColor(Color3.fromRGB(255, 255, 255));
		});
	}

	authenticatePlayer(player: Player) {
		return true;
	}

	sendInteractionMessage(player: Player, message: string) {
		for (const interact of this.interactComponents) {
			interact.messageReceived.Fire(player, message);
		}
	}

	setReaderColor(color: Color3) {
		for (const value of this.instance.Cards.GetChildren()) {
			if (value.IsA("BasePart") && value.Name === "ScannerNeon") {
				value.Color = color;
			}
		}
	}

	getSpringSettings() {
		if (this.attributes.spring?.friction !== undefined && this.attributes.spring.tension) {
			return {
				friction: this.attributes.spring.friction,
				tension: this.attributes.spring.tension,
			} as SpringOptions;
		}
		return this.springSettings;
	}

	weldDoor(directory: Model | Folder, hinge: BasePart) {
		for (const value of directory.GetDescendants()) {
			if (value.IsA("BasePart") && value !== hinge) {
				const weld = new Instance("WeldConstraint");
				weld.Parent = value;
				weld.Part0 = value;
				weld.Part1 = hinge;
				value.Anchored = false;
			}
		}
	}

	bootstrap() {
		if (RunService.IsClient()) {
			const [cf] = this.instance.GetBoundingBox();
			const simulationController = Dependency<SimulationController>();
			this.simNode = simulationController.registerSimulatedObject(cf.Position, {
				callback: (state) => this.simulationStateChange(state),
				type: "door",
			});
			if (this.isSimulated) {
				this.baseMotor.start();
			} else {
				this.baseMotor.stop();
			}
		}

		const components = Dependency<Components>();
		this.doorSound = components.getComponent<DoorSound<any, any>>(this.instance);
		for (const value of this.instance.Cards.GetChildren()) {
			this.validCards.push(value.Name);
		}
		for (const value of this.instance.GetDescendants()) {
			if (value.HasTag("baseInteraction")) {
				const interactionComponent = components.getComponent<BaseInteraction<any, any>>(value);
				if (interactionComponent) {
					this.interactComponents.push(interactionComponent);
					this.maid.GiveTask(interactionComponent.activated.Connect((player) => this.onInteract(player)));
				}
			}
			if (value.HasTag("basePresence")) {
				const presenceComponent = components.getComponent<BasePresence<any, any>>(value);
				if (presenceComponent) {
					this.maid.GiveTask(
						presenceComponent.presenceBegin.Connect((player) => {
							if (this.attributes.open) return;
							if (this.attributes.moving) return;
							this.onInteract(player);
						}),
					);
				}
			}
		}
		this.onAttributeChanged("open", (value, oldValue) => {
			if (value !== oldValue) {
				if (value) {
					this.stateChanged.Fire(true);
					if (this.doorSound) this.doorSound.doorOpen();
					if (RunService.IsClient()) {
						this.baseMotor.spring(this.openMotor, this.getSpringSettings());
					}
				} else {
					this.stateChanged.Fire(false);
					if (this.doorSound) this.doorSound.doorClose();
					if (RunService.IsClient()) {
						this.baseMotor.spring(this.closeMotor, this.getSpringSettings());
					}
				}
			}
		});
	}

	simulationStateChange(state: boolean) {
		this.isSimulated = state;
		if (state) {
			this.baseMotor.start();
		} else {
			this.baseMotor.stop();
		}
	}

	dutyCycle() {
		if (this.attributes.locked) return;
		if (this.attributes.broken) {
			if (RunService.IsClient()) {
				this.baseMotor.spring(0.1, springs.wobbly);
				task.wait(0.1);
				this.baseMotor.spring(0, springs.wobbly);
			}
			return;
		}

		if (this.attributes.moving && this.attributes.canInterrupt) {
			if (this.attributes.autoClose && this.attributes.open) {
				this.attributes.open = false;
				this.attributes.moving = false;
			}
			return;
		}
		this.attributes.moving = true;
		if (!this.attributes.autoClose) {
			this.attributes.open = !this.attributes.open;
		} else {
			this.attributes.open = true;
			const openTick = tick();
			while (math.abs(tick() - openTick) <= (this.attributes.autoCloseDelay ?? 5)) {
				task.wait();
				if (!this.attributes.moving) break;
			}
			task.wait(0.2);
			this.attributes.moving = false;
		}
	}

	onStart() {
		this.bootstrap();
	}

	destroy() {
		super.destroy();
		if (RunService.IsClient() && this.simNode) {
			const simulationController = Dependency<SimulationController>();
			simulationController.unregisterSimulatedObject(this.simNode);
		}
	}
}
