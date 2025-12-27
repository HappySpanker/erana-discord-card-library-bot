import { Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { Dispatcher } from "./slashCommands/Dispatcher.js";
import { ISlashCommandHandler } from "./slashCommands/interfaces/ICommandHandler.js";
import { logger } from "../logger.js";

export class EranaClient extends Client<boolean> {
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
            .then((_) => this._handleClientReady())
            .then((_) => this._addSlashCommandDispatcher());
    }

    private _slashCommandDispatcher: ISlashCommandHandler =
        new Dispatcher();

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
    private _addSlashCommandDispatcher(): void {
        this.on(
            Events.InteractionCreate, 
            async (interaction: Interaction) => {
                if (!interaction.isChatInputCommand()) return;
                
                await this._slashCommandDispatcher.handle(interaction);
            }
        );
    }
}