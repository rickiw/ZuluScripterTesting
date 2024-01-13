import { Flamework } from "@flamework/core";
import { bootstrap } from "./bootstrap/bootstrap";

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components/game");

Flamework.ignite();

bootstrap();
