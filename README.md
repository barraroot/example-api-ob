# API Intermediária Node.js/Express

Esta API serve como um intermediário para se comunicar com os endpoints de registro e autenticação de uma API externa (`https://backoffice.demo-corretora.com/api/v1`). Ela lida com o encaminhamento de requisições, adição de headers necessários (como o token de registro) e tratamento básico de erros.

## Funcionalidades

*   **Registro de Usuário:** Encaminha solicitações de registro para a API externa.
*   **Login de Usuário:** Encaminha solicitações de login (autenticação externa) para a API externa.
*   **Tratamento de Erros:** Captura erros da API externa e os retorna em um formato JSON padronizado.

## Como Executar Localmente

1.  **Clone o repositório (ou certifique-se de ter os arquivos `server.js` e `package.json`).**
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor:**
    ```bash
    node server.js
    ```
    O servidor estará rodando em `http://localhost:3000` (ou na porta definida pela variável de ambiente `PORT`).

## Endpoints da API

### 1. Registro de Usuário

*   **Método:** `POST`
*   **Endpoint:** `/register`
*   **Headers da Requisição:**
    *   `Content-Type: application/json`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "country": "string",
      "password": "string",
      "currency": "string",
      "checked_forgot": true, // Booleano, opcional pela API externa, mas incluído aqui
      "confirmed_country": true, // Booleano, opcional pela API externa, mas incluído aqui
      "ddi": "+55", // String
      "phone": 19998806611, // Número
      "password_confirmation": "string",
      "email": "user@example.com"
    }
    ```
*   **Resposta de Sucesso (2xx):**
    ```json
    {
      "message": "Cadastro realizado com sucesso!",
      "client": "string",
      "token": "string"
    }
    ```
*   **Resposta de Erro (4xx/5xx):**
    *   Erro de validação da API intermediária (campos ausentes, senhas não conferem):
        ```json
        {
          "error": "Mensagem de erro específica",
          "missing": ["campo1", "campo2"] // Se aplicável
        }
        ```
    *   Erro da API externa:
        ```json
        {
          "message": "Erro na comunicação com a API externa.",
          "errorDetails": { ... } // Corpo do erro retornado pela API externa
        }
        ```
    *   Erro de comunicação (timeout, etc.):
        ```json
        {
          "message": "Mensagem de erro de comunicação"
        }
        ```

### 2. Login de Usuário

*   **Método:** `POST`
*   **Endpoint:** `/login`
*   **Headers da Requisição:**
    *   `Content-Type: application/json`
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "user@example.com"
    }
    ```
*   **Resposta de Sucesso (2xx):**
    ```json
    {
      "message": "Login efetuado com sucesso",
      "token": "string",
      "user": "string",
      "url_access": "string"
    }
    ```
*   **Resposta de Erro (4xx/5xx):**
    *   Erro de validação da API intermediária (email ausente):
        ```json
        {
          "error": "O campo email é obrigatório"
        }
        ```
    *   Erro da API externa:
        ```json
        {
          "message": "Erro na comunicação com a API externa.",
          "errorDetails": { ... } // Corpo do erro retornado pela API externa
        }
        ```
    *   Erro de comunicação (timeout, etc.):
        ```json
        {
          "message": "Mensagem de erro de comunicação"
        }
        ```

## Dependências

*   Express: Framework web para Node.js
*   Axios: Cliente HTTP baseado em Promises

