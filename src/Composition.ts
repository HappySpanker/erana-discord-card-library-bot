import { EranaClient } from "./events/EranaClient.js";
import { CardUpload } from "./events/modals/CardUpload.js";
import { CreateModalDisparcher as CreateModalDispatcher } from "./events/modals/ModalDispatcher.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateMyCardsSubhandler } from "./events/slashCommands/cards/MyCardsSubhandler.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";
import { CreateCardStore } from "./external/CardStore.js";
import { database_pool } from "./external/Database.js";
import { CreateCardService } from "./logic/CardService.js";
import { CreateMyCardOrchestrator } from "./orchestration/CardsOrchestrator.Mine.js";
import { CreateStatusOrchestrator } from "./orchestration/StatusOrchestration.js";

export function CreateEranaClient(): EranaClient {
    // External
    const cardStore = CreateCardStore(database_pool);

    // Logic
    const cardService = CreateCardService(cardStore);

    // Orchestrators
    const myCardsOrchestrator = CreateMyCardOrchestrator(cardService);
    const statusOrchestrator = CreateStatusOrchestrator();
    
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