import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const WAHA_API_URL = process.env.WAHA_API_URL || "http://localhost:3000";
const WAHA_SESSION = process.env.WAHA_SESSION || "default";
const WAHA_API_KEY = process.env.WAHA_API_KEY;

export interface Message {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: number;
  fromMe: boolean;
  chatId: string;
}

export class WahaClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: WAHA_API_URL,
      headers: {
        "Content-Type": "application/json",
        ...(WAHA_API_KEY ? { "X-Api-Key": WAHA_API_KEY } : {}),
      },
    });
  }

  async listMessages(chatId: string, limit: number = 10): Promise<Message[]> {
    try {
      // Waha endpoint for getting messages from a chat
      // GET /api/sessions/{session}/chats/{chatId}/messages?limit={limit}
      // Note: Endpoint structure might vary based on Waha version.
      // Assuming standard Waha structure:
      const response = await this.client.get(
        `/api/sessions/${WAHA_SESSION}/chats/${chatId}/messages`,
        {
          params: {
            limit: limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error listing messages:", error);
      throw new Error(`Failed to list messages: ${(error as any).message}`);
    }
  }

  async sendMessage(chatId: string, text: string): Promise<any> {
    try {
      // Waha endpoint for sending text message
      // POST /api/sendText
      const response = await this.client.post("/api/sendText", {
        chatId: chatId,
        text: text,
        session: WAHA_SESSION,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(`Failed to send message: ${(error as any).message}`);
    }
  }
  
  async getMe(): Promise<any> {
      try {
          const response = await this.client.get(`/api/sessions/${WAHA_SESSION}/me`);
          return response.data;
      } catch (error) {
          console.error("Error getting me:", error);
          throw new Error(`Failed to get me: ${(error as any).message}`);
      }
  }
  
    async getAllChats(): Promise<any> {
      try {
          const response = await this.client.get(`/api/sessions/${WAHA_SESSION}/chats`);
          return response.data;
      } catch (error) {
          console.error("Error getting chats:", error);
          throw new Error(`Failed to get chats: ${(error as any).message}`);
      }
  }
}
