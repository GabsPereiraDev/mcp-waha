import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { WahaClient } from "./waha-client";
import dotenv from "dotenv";

dotenv.config();

const wahaClient = new WahaClient();

const server = new Server(
  {
    name: "waha-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_chats",
        description: "List available chats/conversations",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_messages",
        description: "List messages from a specific chat",
        inputSchema: {
          type: "object",
          properties: {
            chatId: {
              type: "string",
              description: "The chat ID (e.g., 1234567890@c.us)",
            },
            limit: {
              type: "number",
              description: "Number of messages to retrieve (default: 10)",
            },
          },
          required: ["chatId"],
        },
      },
      {
        name: "send_message",
        description: "Send a text message to a chat",
        inputSchema: {
          type: "object",
          properties: {
            chatId: {
              type: "string",
              description: "The chat ID to send the message to",
            },
            text: {
              type: "string",
              description: "The text content of the message",
            },
          },
          required: ["chatId", "text"],
        },
      },
      {
        name: "get_me",
        description: "Get information about the current session user",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_chats": {
        const chats = await wahaClient.getAllChats();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(chats, null, 2),
            },
          ],
        };
      }

      case "list_messages": {
        const chatId = String(args?.chatId);
        const limit = Number(args?.limit) || 10;
        if (!chatId) {
          throw new Error("chatId is required");
        }
        const messages = await wahaClient.listMessages(chatId, limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(messages, null, 2),
            },
          ],
        };
      }

      case "send_message": {
        const chatId = String(args?.chatId);
        const text = String(args?.text);
        if (!chatId || !text) {
          throw new Error("chatId and text are required");
        }
        const result = await wahaClient.sendMessage(chatId, text);
        return {
          content: [
            {
              type: "text",
              text: `Message sent successfully: ${JSON.stringify(result)}`,
            },
          ],
        };
      }

      case "get_me": {
        const me = await wahaClient.getMe();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(me, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
