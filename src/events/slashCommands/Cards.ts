import { ChatInputCommandInteraction } from "discord.js";
import { ISlashCommandHandler } from "./interfaces/ICommandHandler.js";

export class CardsSlashCommandsHandler implements ISlashCommandHandler {
  static Identifier = "cards"

  constructor(
  ) { }

  public async Handle(interaction: ChatInputCommandInteraction): Promise<void> {

  }
}