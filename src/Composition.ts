import { EranaClient } from "./events/EranaClient.js";
import { CreateModalDisparcher as CreateModalDispatcher } from "./events/modals/ModalSubmitDispatcher.js";
import { CardSlashCommandHandler } from "./events/slashCommands/Card.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";
import { CreateApplicationStore } from "./external/ApplicationStore.js";
import { CreateCardStore } from "./external/CardStore.js";
import { database_pool } from "./external/Database.js";
import { CreateSystemStore } from "./external/SystemStore.js";
import { CreateUserStore } from "./external/UserStore.js";
import { CreateApplicationService } from "./logic/ApplicationService.js";
import { CreateCardService } from "./logic/CardService.js";
import { CreateSystemService } from "./logic/SystemService.js";
import { CreateUserService } from "./logic/UserService.js";
import { CreateMyCardOrchestrator } from "./orchestration/CardsOrchestrator.Mine.js";
import { CreateStatusOrchestrator } from "./orchestration/StatusOrchestration.js";

export function CreateEranaClient(): EranaClient {
    // External
    const applicationStore = CreateApplicationStore();
    const cardStore = CreateCardStore(database_pool);
    const systemStore = CreateSystemStore();
    const userStore = CreateUserStore(database_pool);

    // Logic
    const applicationService = CreateApplicationService(applicationStore);
    const cardService = CreateCardService(cardStore);
    const systemService = CreateSystemService(systemStore);
    const userService = CreateUserService(userStore);

    // Orchestrators
    const myCardsOrchestrator = CreateMyCardOrchestrator(cardService, userService);
    const statusOrchestrator = CreateStatusOrchestrator(applicationService, systemService);
    
    // Events: slash commands
    const cardSlashCommandHandler = new CardSlashCommandHandler();
    const cardsSlashCommandHandler = new CardsSlashCommandsHandler();
    const statusSlashCommandHandler = new StatusSlashCommandHandler(statusOrchestrator);

    const slashCommandDispatcher = CreateSlashCommandDispatcher();
    slashCommandDispatcher.RegisterHandler(CardSlashCommandHandler.Identifier, cardSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler(CardsSlashCommandsHandler.Identifier, cardsSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler(StatusSlashCommandHandler.Identifier, statusSlashCommandHandler);

    // Events modals
    const modalSubmitDispatcher = CreateModalDispatcher();

    // Application
    return new EranaClient(
        slashCommandDispatcher,
        modalSubmitDispatcher
    );
}