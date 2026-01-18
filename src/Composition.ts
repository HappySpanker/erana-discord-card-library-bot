import { EranaClient } from "./events/EranaClient.js";
import { CardUpload } from "./events/modals/CardUpload.js";
import { CreateModalDisparcher as CreateModalDispatcher } from "./events/modals/ModalDispatcher.js";
import { CardsSlashCommandsHandler } from "./events/slashCommands/Cards.js";
import { CreateMyCardsSubhandler } from "./events/slashCommands/cards/MyCardsSubhandler.js";
import { CreateSlashCommandDispatcher } from "./events/slashCommands/SlashCommandDispatcher.js";
import { StatusSlashCommandHandler } from "./events/slashCommands/Status.js";
import { CreateCardService } from "./logic/CardService.js";
import { CreateMyCardOrchestrator } from "./orchestration/CardsOrchestrator.Mine.js";

export function CreateEranaClient(): EranaClient {

    // Logic
    const cardService = CreateCardService();

    // Orchestrators
    const myCardsOrchestrator = CreateMyCardOrchestrator(cardService);
    
    const myCardsSubhandler = CreateMyCardsSubhandler(myCardsOrchestrator);
    
    // Slash commands
    const cardsSlashCommandHandler = new CardsSlashCommandsHandler(myCardsSubhandler);
    const statusSlashCommandHandler = new StatusSlashCommandHandler();

    const slashCommandDispatcher = CreateSlashCommandDispatcher();
    slashCommandDispatcher.RegisterHandler("cards", cardsSlashCommandHandler);
    slashCommandDispatcher.RegisterHandler("status", statusSlashCommandHandler);

    // Modals
    const cardUploadModal = new CardUpload(myCardsOrchestrator);

    const modalDispatcher = CreateModalDispatcher();
    modalDispatcher.RegisterHandler(CardUpload.customId, cardUploadModal);

    return new EranaClient(
        slashCommandDispatcher
    );
}