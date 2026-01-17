import { EranaClient } from "./events/EranaClient.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";

export function CreateEranaClient(): EranaClient {
    const cardsSlashCommandHandler = new CardsSlashCommandsHandler();
    const statusSlashCommandHandler = new StatusSlashCommandHandler();

    const slashCommandDispatcher = CreateSlashCommandDispatcher();
    slashCommandDispatcher.RegisterHandler("cards", cardsSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler("status", statusSlashCommandHandler);

    return new EranaClient(
        slashCommandDispatcher
    );
}