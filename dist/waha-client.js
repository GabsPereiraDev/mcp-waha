"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WahaClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WAHA_API_URL = process.env.WAHA_API_URL || "http://localhost:3000";
const WAHA_SESSION = process.env.WAHA_SESSION || "default";
const WAHA_API_KEY = process.env.WAHA_API_KEY;
class WahaClient {
    client;
    constructor() {
        this.client = axios_1.default.create({
            baseURL: WAHA_API_URL,
            headers: {
                "Content-Type": "application/json",
                ...(WAHA_API_KEY ? { "X-Api-Key": WAHA_API_KEY } : {}),
            },
        });
    }
    async listMessages(chatId, limit = 10) {
        try {
            // Waha endpoint for getting messages from a chat
            // GET /api/sessions/{session}/chats/{chatId}/messages?limit={limit}
            // Note: Endpoint structure might vary based on Waha version.
            // Assuming standard Waha structure:
            const response = await this.client.get(`/api/sessions/${WAHA_SESSION}/chats/${chatId}/messages`, {
                params: {
                    limit: limit,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error("Error listing messages:", error);
            throw new Error(`Failed to list messages: ${error.message}`);
        }
    }
    async sendMessage(chatId, text) {
        try {
            // Waha endpoint for sending text message
            // POST /api/sendText
            const response = await this.client.post("/api/sendText", {
                chatId: chatId,
                text: text,
                session: WAHA_SESSION,
            });
            return response.data;
        }
        catch (error) {
            console.error("Error sending message:", error);
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }
    async getMe() {
        try {
            const response = await this.client.get(`/api/sessions/${WAHA_SESSION}/me`);
            return response.data;
        }
        catch (error) {
            console.error("Error getting me:", error);
            throw new Error(`Failed to get me: ${error.message}`);
        }
    }
    async getAllChats() {
        try {
            const response = await this.client.get(`/api/sessions/${WAHA_SESSION}/chats`);
            return response.data;
        }
        catch (error) {
            console.error("Error getting chats:", error);
            throw new Error(`Failed to get chats: ${error.message}`);
        }
    }
}
exports.WahaClient = WahaClient;
