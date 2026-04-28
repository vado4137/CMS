import { getDiscordClient } from "./client";
import { getDiscordDestination } from "./resolver";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export async function sendDiscordNotification(
  factionId: string, 
  type: 'logs' | 'abmeldung' | 'ausbildung',
  message: { title: string; description: string; color?: number; requestId?: string }
) {
  try {
    // 1. Ziel-Channel finden
    const destination = await getDiscordDestination(factionId, type);
    if (!destination.channelId) return;

    // 2. Bot holen
    const client = await getDiscordClient();
    if (!client) return;

    const channel = await client.channels.fetch(destination.channelId);
    
    if (channel?.isSendable()) {
      const embed = new EmbedBuilder()
        .setTitle(message.title)
        .setDescription(message.description)
        .setColor(message.color || 0x3b82f6) // Default Blau
        .setTimestamp();

      if (type === "ausbildung" && message.requestId) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`accept_training_${message.requestId}`)
            .setLabel("Ausbildung annehmen")
            .setStyle(ButtonStyle.Primary),
        );

        await channel.send({ embeds: [embed], components: [row] });
        return;
      }

      await channel.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Fehler beim Senden der Discord-Nachricht:", error);
  }
}