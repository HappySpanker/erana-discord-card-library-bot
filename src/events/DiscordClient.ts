import { Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { Dispatcher } from "./slashCommands/Dispatcher.js";
import { ISlashCommandHandler } from "./slashCommands/interfaces/ICommandHandler.js";
import { logger } from "../logger.js";

export class DiscordClient {
    /**
     * Create a new Discord.js client
     */
    private _client = 
        new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

    private _slashCommandDispatcher: ISlashCommandHandler =
        new Dispatcher();

    /**
     * Connect the given client to discord
     */
    public async connect(): Promise<void> {
        await this._client.login(process.env.DISCORD_TOKEN);

        this._handleClientReady();
    }

    /**
     * Handle ClientReady event
     */
    private _handleClientReady() {
        this._client.once(
            Events.ClientReady, 
            async (readyClient: Client<true>) => {
                logger.info({
                    event: "client_ready",
                    userTag: readyClient.user.tag
                })

                this._addSlashCommandDispatcher();
            });
    }

    /**
     * Handle Slash Commands
     */
    private _addSlashCommandDispatcher(): void {
        this._client.on(
            Events.InteractionCreate, 
            async (interaction: Interaction) => {
                if (!interaction.isChatInputCommand()) return;
                
                await this._slashCommandDispatcher.handle(interaction);
            }
        );
    }
}