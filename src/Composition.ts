import { EranaClient } from "./events/EranaClient.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";

export function CreateEranaClient(): EranaClient {
    const slashCommandDispatcher = CreateSlashCommandDispatcher();

    return new EranaClient(
        slashCommandDispatcher
    );
}