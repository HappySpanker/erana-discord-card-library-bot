import { Client, Events, GatewayIntentBits } from "discord.js";

export class DiscordClient {
    private _client: Client<true>;

    constructor() {
        this._client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })        
    }

    public async connect(): Promise<void> {
        await this._client.login(process.env.DISCORD_TOKEN);
    }

    public registerClientReady() {
        this._client.once(Events.ClientReady, async (readyClient: Client<true>) =>  {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        });
    }
}