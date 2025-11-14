# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar a aplicação
RUN npm run build

# Stage 2: Production dependencies
FROM node:22-alpine AS deps

WORKDIR /app

# Copiar apenas arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && \
  npm cache clean --force

# Stage 3: Final image (minimal - usando alpine para imagem pequena)
FROM node:22-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

WORKDIR /app

# Copiar dependências de produção do stage deps
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copiar código compilado do stage builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Copiar arquivos de configuração necessários
COPY --from=builder --chown=nestjs:nodejs /app/src/app-config/firebase-config.json ./src/app-config/firebase-config.json

# Mudar para usuário não-root
USER nestjs

# Expor porta (ajustar conforme necessário)
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]

