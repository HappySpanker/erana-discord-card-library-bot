import { EranaClient } from "./events/EranaClient.js";
import { CardUpload } from "./events/modals/CardUpload.js";
import { CreateModalDisparcher as CreateModalDispatcher } from "./events/modals/ModalDispatcher.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateMyCardsSubhandler } from "./events/slashCommands/cards/MyCardsSubhandler.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";
import { CreateCardStore } from "./external/CardStore.js";
import { database_pool } from "./external/Database.js";
import { CreateApplicationService } from "./logic/ApplicationService.js";
import { CreateCardService } from "./logic/CardService.js";
import { CreateSystemService } from "./logic/SystemService.js";
import { CreateMyCardOrchestrator } from "./orchestration/CardsOrchestrator.Mine.js";
import { CreateStatusOrchestrator } from "./orchestration/StatusOrchestration.js";

export function CreateEranaClient(): EranaClient {
    // External
    const cardStore = CreateCardStore(database_pool);

    // Logic
    const cardService = CreateCardService(cardStore);
    const applicationService = CreateApplicationService();
    const systemService = CreateSystemService();

    // Orchestrators
    const myCardsOrchestrator = CreateMyCardOrchestrator(cardService);
    const statusOrchestrator = CreateStatusOrchestrator(
        applicationService,
        systemService
    );
    
    // Events: slash commands
    const myCardsSubhandler = CreateMyCardsSubhandler(myCardsOrchestrator);
    const cardsSlashCommandHandler = new CardsSlashCommandsHandler(myCardsSubhandler);
    const statusSlashCommandHandler = new StatusSlashCommandHandler(statusOrchestrator);

    const slashCommandDispatcher = CreateSlashCommandDispatcher();
    slashCommandDispatcher.RegisterHandler("cards", cardsSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler("status", statusSlashCommandHandler);

    // Events modals
    const cardUploadModal = new CardUpload(myCardsOrchestrator);

    const modalDispatcher = CreateModalDispatcher();
    modalDispatcher.RegisterHandler(CardUpload.customId, cardUploadModal);

    // Application
    return new EranaClient(
        slashCommandDispatcher
    );
}