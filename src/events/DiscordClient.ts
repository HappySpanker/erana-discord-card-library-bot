import { CacheType, ChatInputCommandInteraction, Client, CommandInteraction, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";

export class DiscordClient {

    private _client: Client<true>;

    constructor() {
        this._client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });
    }

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
                
                await interaction.reply("noop");
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