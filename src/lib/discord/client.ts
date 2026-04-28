import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import db from "@/lib/db";
import { decryptIfEncrypted } from "@/lib/encryption";

// Singleton-Instanz verhindern, dass Next.js im Dev-Modus 100 Bots startet
const globalForDiscord = global as unknown as {
  discordClient: Client | undefined;
  discordInteractionHandlerBound: boolean | undefined;
};

function registerInteractionHandlers(client: Client) {
  if (globalForDiscord.discordInteractionHandlerBound) return;

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("accept_training_")) return;

    const requestId = interaction.customId.replace("accept_training_", "");
    if (!requestId) {
      await interaction.reply({ content: "Ungültige Anfrage-ID.", ephemeral: true });
      return;
    }

    try {
      const account = await db.account.findFirst({
        where: {
          provider: "discord",
          providerAccountId: interaction.user.id,
        },
        select: { userId: true },
      });

      if (!account?.userId) {
        await interaction.reply({
          content: "Du bist kein autorisierter Ausbilder für dieses Modul.",
          ephemeral: true,
        });
        return;
      }

      const request = await db.trainingRequest.findUnique({
        where: { id: requestId },
        include: {
          trainingType: {
            include: {
              authorizedInstructors: {
                select: { id: true },
              },
            },
          },
        },
      });

      if (!request) {
        await interaction.reply({ content: "Anfrage wurde nicht gefunden.", ephemeral: true });
        return;
      }

      const instructorMember = await db.member.findFirst({
        where: {
          userId: account.userId,
          factionId: request.factionId,
        },
        select: { id: true, firstName: true, lastName: true },
      });

      const isAuthorized = !!instructorMember && request.trainingType.authorizedInstructors.some(
        (authorized) => authorized.id === instructorMember.id,
      );

      if (!isAuthorized) {
        await interaction.reply({
          content: "Du bist kein autorisierter Ausbilder für dieses Modul.",
          ephemeral: true,
        });
        return;
      }

      const updated = await db.trainingRequest.update({
        where: { id: request.id },
        data: {
          status: "PLANNING",
          instructorId: instructorMember.id,
        },
      });

      const originalEmbed = interaction.message.embeds[0];
      const acceptedBy = `${instructorMember.firstName} ${instructorMember.lastName}`;
      const embed = new EmbedBuilder()
        .setTitle(originalEmbed?.title ?? "Ausbildungsanfrage")
        .setDescription(
          `${originalEmbed?.description ?? "Anfrage angenommen."}\n\n**Angenommen von:** ${acceptedBy}`,
        )
        .setColor(0x22c55e)
        .setTimestamp(updated.updatedAt);

      await interaction.update({
        embeds: [embed],
        components: [],
      });
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Discord-Interaktion:", error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "Fehler beim Annehmen der Ausbildungsanfrage.",
          ephemeral: true,
        });
      }
    }
  });

  globalForDiscord.discordInteractionHandlerBound = true;
}

export async function getDiscordClient() {
  if (globalForDiscord.discordClient) return globalForDiscord.discordClient;

  const config = await db.systemConfig.findUnique({ where: { id: "system" } });
  
  if (!config?.discordBotToken) {
    console.warn("Kein Discord Bot Token konfiguriert.");
    return null;
  }

  try {
    // 1. Token entschlüsseln
    const decryptedToken = decryptIfEncrypted(config.discordBotToken);

    // 2. Client erstellen
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
    });

    await client.login(decryptedToken);
    registerInteractionHandlers(client);
    
    if (process.env.NODE_ENV !== 'production') globalForDiscord.discordClient = client;
    return client;
  } catch (error) {
    console.error("Discord Login fehlgeschlagen:", error);
    return null;
  }
}