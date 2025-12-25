import { Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { StatusSlashCommandHandler } from "./slashCommands/Status.js";

export class DiscordClient {
    /**
     * Create a new Discord.js client
     */
    private _client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    /**
     * Login to the given client
     */
    public async connect(): Promise<void> {
        await this._client.login(process.env.DISCORD_TOKEN);
    }

    /**
     * DEBUG: remove me!
     */
    public async registerSlashCommands(): Promise<void> {
        this._client.on(
            Events.InteractionCreate, 
            async (interaction: Interaction) => {
                if (!interaction.isChatInputCommand()) return;
                
                switch (interaction.commandName) {
                    case "status":
                        const sch = new StatusSlashCommandHandler();
                        sch.handle(interaction);
                        break;

                    case "cards":
                        interaction.reply({ 
                            content: `Okidoki! target:${interaction.options.getUser("target", true).displayName}, search:${interaction.options.getString("search", false)}`,
                            flags: MessageFlags.Ephemeral
                        });
                        break;
                
                    default:
                        console.error(`Received command "${interaction.commandName}" but command not found!`);
                        console.debug(interaction);
                        break;
                }

            }
        );
    }

    /**
     * DEBUG: remove me!
     */
    public registerClientReady() {
        this._client.once(Events.ClientReady, async (readyClient: Client<true>) =>  {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    }
}