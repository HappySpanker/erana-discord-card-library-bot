import { EranaClient } from "./events/EranaClient.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateMyCardsSubhandler } from "./events/slashCommands/MyCardsSubhandler.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";
import { CreateMyCardOrchestrator } from "./orchestration/CardsOrchestrator.Mine.js";

export function CreateEranaClient(): EranaClient {
    const myCardsOrchestrator = CreateMyCardOrchestrator();
    const myCardsSubhandler = CreateMyCardsSubhandler(myCardsOrchestrator);

    const cardsSlashCommandHandler = new CardsSlashCommandsHandler(myCardsSubhandler);
    const statusSlashCommandHandler = new StatusSlashCommandHandler();

    const slashCommandDispatcher = CreateSlashCommandDispatcher();
    slashCommandDispatcher.RegisterHandler("cards", cardsSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler("status", statusSlashCommandHandler);

    return new EranaClient(
        slashCommandDispatcher
    );
}