import { Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { SlashCommandDispatcher } from "./slashCommands/SlashCommandDispatcher.js";
import { ISlashCommandHandler } from "./slashCommands/interfaces/ICommandHandler.js";
import { logger } from "../logger.js";
import { ModalDispatcher } from "./modals/ModalDispatcher.js";

export class EranaClient extends Client<boolean> {
    private _modalSubmitDispatcher = new ModalDispatcher();
    private _slashCommandDispatcher = new SlashCommandDispatcher();

    /**
     * Create a new EranaClient which inherits/extends from the base discord.js client
     */
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        // Sanity checks
        if (!process.env.DISCORD_TOKEN) {
            throw new Error("Discord token expected in environment variables but not found.")
        }
        
        // Handle login; Promise abuse but whatever
        this.login(process.env.DISCORD_TOKEN)
            .then(_ => this._handleClientReady())
            .then(_ => this._addSlashCommandDispatcher())
            .then(_ => this._addModalSubmitDispatcher())
    }

    /**
     * Handle ClientReady event
     */
    private async _handleClientReady(): Promise<void> {
        this.once(
            Events.ClientReady, 
            async (readyClient: Client<true>) => {
                logger.info({
                    event: "client_ready",
                    userTag: readyClient.user.tag
                })
            });
    }

    /**
     * Handle Slash Commands
     */
    private async _addSlashCommandDispatcher(): Promise<void> {
        this.on(
            Events.InteractionCreate, 
            async (interaction: Interaction) => {
                if (interaction.isChatInputCommand()) {                
                    await this._slashCommandDispatcher.dispatch(interaction);
                    return;
                }
            }
        );
    }

    /**
     * Handle modals
     */
    private async _addModalSubmitDispatcher(): Promise<void> {
        this.on(
            Events.InteractionCreate,
            async (interaction: Interaction) => {
                if (interaction.isModalSubmit()) {
                    await this._modalSubmitDispatcher.dispatch(interaction);
                    return;
                }
            }
        )
    }
}