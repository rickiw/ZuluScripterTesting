import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { DAMAGE_BALANCE_FACTORS } from "shared/constants/firearm";
import { store } from "./store";

print(DAMAGE_BALANCE_FACTORS);

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components/game");

Flamework.ignite();

store.getActions();
