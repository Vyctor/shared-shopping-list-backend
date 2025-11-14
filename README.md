# 🛒 Shared Shopping List Backend

Backend API para gerenciamento de listas de compras compartilhadas, desenvolvido com NestJS e Firebase.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [Docker](#docker)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Shared Shopping List Backend** é uma API RESTful desenvolvida para gerenciar listas de compras compartilhadas entre múltiplos usuários. A aplicação permite criar, visualizar, atualizar e deletar itens de compras, além de gerenciar autenticação de usuários.

### Principais Características

- ✅ Autenticação JWT
- ✅ CRUD completo de itens de compras
- ✅ Validação de dados com class-validator
- ✅ Armazenamento no Firebase Firestore
- ✅ Cobertura de testes acima de 90%
- ✅ Dockerização com multistage build
- ✅ CORS habilitado
- ✅ TypeScript com tipagem forte

## 🛠 Tecnologias Utilizadas

### Core

- **[NestJS](https://nestjs.com/)** (v11.0.1) - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** (v5.7.3) - Linguagem de programação
- **[Node.js](https://nodejs.org/)** (v22) - Runtime JavaScript

### Autenticação e Segurança

- **[@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt)** (v11.1.0) - Autenticação JWT
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** (v3.0.3) - Hash de senhas

### Banco de Dados

- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** (v12.5.0) - Banco de dados NoSQL
- **[nestjs-firebase](https://www.npmjs.com/package/nestjs-firebase)** (v11.0.1) - Integração NestJS com Firebase

### Validação e Transformação

- **[class-validator](https://www.npmjs.com/package/class-validator)** (v0.14.2) - Validação de DTOs
- **[class-transformer](https://www.npmjs.com/package/class-transformer)** (v0.5.1) - Transformação de objetos

### Configuração

- **[@nestjs/config](https://www.npmjs.com/package/@nestjs/config)** (v4.0.2) - Gerenciamento de variáveis de ambiente

### Testes

- **[Jest](https://jestjs.io/)** (v30.0.0) - Framework de testes
- **[Supertest](https://www.npmjs.com/package/supertest)** (v7.0.0) - Testes de integração HTTP
- **[@nestjs/testing](https://www.npmjs.com/package/@nestjs/testing)** (v11.0.1) - Utilitários de teste do NestJS

### Desenvolvimento

- **[ESLint](https://eslint.org/)** (v9.18.0) - Linter
- **[Prettier](https://prettier.io/)** (v3.4.2) - Formatador de código
- **[TypeScript ESLint](https://typescript-eslint.io/)** (v8.20.0) - Linter para TypeScript

## ✨ Funcionalidades

### Autenticação

- **Login**: Autenticação de usuários com email e senha
- **Geração de Token JWT**: Retorna token de acesso após login bem-sucedido
- **Validação de Credenciais**: Verificação segura de senhas com bcrypt

### Gerenciamento de Usuários

- **Criação de Usuários**: Cadastro de novos usuários com email e senha
- **Validação de Email**: Verificação de formato de email válido
- **Hash de Senhas**: Senhas armazenadas de forma segura com bcrypt
- **Prevenção de Duplicatas**: Validação para evitar emails duplicados

### Gerenciamento de Itens de Compra

- **Listar Itens**: Obter todos os itens da lista de compras
- **Buscar Item**: Obter um item específico por ID
- **Criar Item**: Adicionar novos itens à lista
- **Atualizar Item**: Modificar itens existentes (parcial ou completo)
- **Deletar Item**: Remover itens da lista
- **Rastreamento de Compra**: Marcar itens como comprados/não comprados
- **Associação de Usuário**: Cada item está associado a um usuário

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
- **npm** (v9 ou superior) ou **yarn**
- **Firebase Project** com Firestore habilitado
- **Arquivo de credenciais do Firebase** (`firebase-config.json`)

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd shared-shopping-list-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção [Configuração](#configuração))

4. Configure o Firebase (veja seção [Configuração](#configuração))

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
APP_PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
```

### Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Habilite o **Firestore Database**
3. Baixe o arquivo de credenciais do serviço (Service Account Key)
4. Renomeie o arquivo para `firebase-config.json`
5. Coloque o arquivo em `src/app-config/firebase-config.json`

**Estrutura esperada do `firebase-config.json`:**

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
# Modo desenvolvimento com hot-reload
npm run start:dev

# Modo debug
npm run start:debug
```

### Produção

```bash
# Compilar o projeto
npm run build

# Executar em produção
npm run start:prod
```

### Outros Comandos

```bash
# Formatar código
npm run format

# Executar linter
npm run lint

# Compilar
npm run build
```

## 📡 Endpoints da API

Base URL: `http://localhost:3000`

### 🔐 Autenticação

#### POST `/auth/login`

Autentica um usuário e retorna um token JWT.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validações:**

- `email`: Deve ser um email válido
- `password`: String com 8-32 caracteres

**Response 200:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "User or password is incorrect",
  "error": "Bad Request"
}
```

---

### 👤 Usuários

#### POST `/user/create`

Cria um novo usuário no sistema.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Validações:**

- `email`: Deve ser um email válido
- `password`: String com 8-32 caracteres

**Response 201:**

```json
{}
```

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "User already exists",
  "error": "Bad Request"
}
```

---

### 🛒 Itens de Compra

#### GET `/shopping-list-item`

Retorna todos os itens da lista de compras.

**Response 200:**

```json
[
  {
    "id": "item-123",
    "name": "Maçã",
    "quantity": 5,
    "user": "user-123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isPurchased": false
  },
  {
    "id": "item-456",
    "name": "Banana",
    "quantity": 3,
    "user": "user-456",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "isPurchased": true
  }
]
```

---

#### GET `/shopping-list-item/:id`

Retorna um item específico por ID.

**Path Parameters:**

- `id`: ID do item (string)

**Response 200:**

```json
{
  "id": "item-123",
  "name": "Maçã",
  "quantity": 5,
  "user": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isPurchased": false
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Shopping list item not found",
  "error": "Not Found"
}
```

---

#### POST `/shopping-list-item`

Cria um novo item na lista de compras.

**Request Body:**

```json
{
  "name": "Maçã",
  "quantity": 5,
  "user": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isPurchased": false
}
```

**Validações:**

- `name`: String não vazia (obrigatório)
- `quantity`: Número inteiro maior ou igual a 1 (obrigatório)
- `user`: String não vazia (obrigatório)
- `createdAt`: String de data ISO (obrigatório)
- `isPurchased`: Boolean (obrigatório)

**Response 201:**

```json
{
  "id": "item-123",
  "name": "Maçã",
  "quantity": 5,
  "user": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isPurchased": false
}
```

---

#### PUT `/shopping-list-item/:id`

Atualiza um item existente (atualização parcial).

**Path Parameters:**

- `id`: ID do item (string)

**Request Body:**

```json
{
  "name": "Maçã Verde",
  "quantity": 10,
  "isPurchased": true
}
```

**Validações:**

- Todos os campos são opcionais
- `name`: String (se fornecido)
- `quantity`: Número inteiro maior ou igual a 1 (se fornecido)
- `user`: String (se fornecido)
- `isPurchased`: Boolean (se fornecido)

**Response 200:**

```json
{
  "id": "item-123",
  "name": "Maçã Verde",
  "quantity": 10,
  "user": "user-123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isPurchased": true
}
```

---

#### DELETE `/shopping-list-item/:id`

Remove um item da lista de compras.

**Path Parameters:**

- `id`: ID do item (string)

**Response 200:**

```json
{}
```

---

## 🧪 Testes

O projeto possui cobertura de testes acima de 90% com testes unitários e de integração.

### Executar Testes

```bash
# Testes unitários
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes de integração (e2e)
npm run test:e2e
```

### Estrutura de Testes

- **Testes Unitários**: Testam serviços, controllers e repositórios isoladamente
- **Testes de Integração (E2E)**: Testam os endpoints completos da API
- **Cobertura**: Statements 100%, Functions 100%, Lines 100%

### Exemplos de Testes

```bash
# Executar um arquivo específico
npm test -- shopping-list-item.service.spec.ts

# Executar testes com cobertura detalhada
npm run test:cov -- --verbose
```

## 🐳 Docker

O projeto inclui Dockerfile com multistage build para otimização.

### Build da Imagem

```bash
# Build padrão
docker build -t shared-shopping-list-backend .

# Build com cache
docker build --cache-from shared-shopping-list-backend -t shared-shopping-list-backend .
```

### Executar com Docker

```bash
docker run -p 3000:3000 \
  -e APP_PORT=3000 \
  -e JWT_SECRET=your-secret-key \
  -e JWT_EXPIRES_IN=1h \
  -v $(pwd)/src/app-config/firebase-config.json:/app/src/app-config/firebase-config.json:ro \
  shared-shopping-list-backend
```

### Docker Compose

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📁 Estrutura do Projeto

```
shared-shopping-list-backend/
├── src/
│   ├── app-config/          # Configurações da aplicação
│   │   ├── app-config.module.ts
│   │   ├── environment.service.ts
│   │   └── firebase-config.json
│   ├── auth/                # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dtos/
│   │       └── login.dto.ts
│   ├── user/                # Módulo de usuários
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.module.ts
│   │   └── dtos/
│   │       └── create-user.dto.ts
│   ├── shopping-list-item/  # Módulo de itens de compra
│   │   ├── shopping-list-item.controller.ts
│   │   ├── shopping-list-item.service.ts
│   │   ├── shopping-list-item.repository.ts
│   │   ├── shopping-list-item.module.ts
│   │   ├── entities/
│   │   │   └── shopping-list-item.ts
│   │   └── dtos/
│   │       ├── create-shopping-list-item.dto.ts
│   │       └── update-shopping-list-item.dto.ts
│   ├── infra/               # Infraestrutura (Firebase)
│   │   └── infra.module.ts
│   ├── app.module.ts        # Módulo raiz
│   └── main.ts              # Arquivo de entrada
├── test/                    # Testes de integração (e2e)
│   ├── auth.e2e-spec.ts
│   ├── user.e2e-spec.ts
│   └── shopping-list-item.e2e-spec.ts
├── dist/                    # Código compilado (gerado)
├── coverage/               # Relatórios de cobertura (gerado)
├── .dockerignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

### Arquitetura

O projeto segue a arquitetura modular do NestJS:

- **Controllers**: Gerenciam requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Repositories**: Abstraem o acesso ao banco de dados (Firebase)
- **DTOs**: Objetos de transferência de dados com validação
- **Entities**: Modelos de domínio
- **Modules**: Organizam e conectam os componentes

## 🔒 Segurança

- ✅ Senhas armazenadas com hash bcrypt (10 rounds)
- ✅ Autenticação JWT com expiração configurável
- ✅ Validação de entrada com class-validator
- ✅ CORS configurado
- ✅ Usuário não-root no Docker
- ✅ Variáveis de ambiente para configurações sensíveis

## 📝 Scripts Disponíveis

| Script                | Descrição                                     |
| --------------------- | --------------------------------------------- |
| `npm run build`       | Compila o projeto TypeScript                  |
| `npm run start`       | Inicia a aplicação em modo produção           |
| `npm run start:dev`   | Inicia em modo desenvolvimento com hot-reload |
| `npm run start:debug` | Inicia em modo debug                          |
| `npm run start:prod`  | Executa a versão compilada                    |
| `npm test`            | Executa testes unitários                      |
| `npm run test:watch`  | Executa testes em modo watch                  |
| `npm run test:cov`    | Executa testes com cobertura                  |
| `npm run test:e2e`    | Executa testes de integração                  |
| `npm run lint`        | Executa o linter                              |
| `npm run format`      | Formata o código com Prettier                 |

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript com tipagem forte
- Siga os padrões do ESLint configurado
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 90%
- Documente código complexo

## 📄 Licença

Este projeto é privado e não possui licença pública.

## 👨‍💻 Autor

Desenvolvido como parte do projeto Shared Shopping List.

---

**Desenvolvido com ❤️ usando NestJS**
