# MCP Waha Server

Este é um servidor MCP (Model Context Protocol) para interagir com a API do Waha (WhatsApp HTTP API).
Ele permite listar mensagens, enviar mensagens e gerenciar chats diretamente através de um cliente MCP como o Trae ou Claude Desktop.

## Ferramentas Disponíveis

*   `list_chats`: Lista os chats disponíveis.
*   `list_messages`: Lista as mensagens de um chat específico.
    *   `chatId` (obrigatório): O ID do chat (ex: `1234567890@c.us`).
    *   `limit` (opcional): Número de mensagens (padrão: 10).
*   `send_message`: Envia uma mensagem de texto para um chat.
    *   `chatId` (obrigatório): O ID do chat.
    *   `text` (obrigatório): O conteúdo da mensagem.
*   `get_me`: Retorna informações sobre a sessão atual do Waha.

## Instalação

1.  Clone este repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Compile o projeto:
    ```bash
    npm run build
    ```

## Configuração

O servidor utiliza variáveis de ambiente para configuração. Você pode criar um arquivo `.env` baseado no `.env.example` ou passar as variáveis diretamente na configuração do cliente MCP.

Variáveis:
*   `WAHA_API_URL`: URL base da API do Waha (ex: `http://localhost:3000`).
*   `WAHA_SESSION`: Nome da sessão do Waha (padrão: `default`).
*   `WAHA_API_KEY`: Chave de API (se necessária).

## Integração com Trae / Claude Desktop

Adicione a seguinte configuração ao seu arquivo de configuração de servidores MCP (ex: `claude_desktop_config.json` ou nas configurações do Trae):

```json
{
  "mcpServers": {
    "waha": {
      "command": "node",
      "args": ["/caminho/para/mcp-waha/dist/index.js"],
      "env": {
        "WAHA_API_URL": "http://localhost:3000",
        "WAHA_SESSION": "default",
        "WAHA_API_KEY": "sua_chave_secreta"
      }
    }
  }
}
```

Certifique-se de ajustar o caminho para o arquivo `dist/index.js` e as variáveis de ambiente conforme sua configuração.

## Desenvolvimento

Para rodar em modo de desenvolvimento:

```bash
npm run dev
```
