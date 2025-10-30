# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas o que é necessário para instalar dependências
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o restante do projeto e compila
COPY . .
RUN yarn build

# Etapa 2: Execução
FROM node:20-alpine

WORKDIR /app

# Copia apenas arquivos essenciais do build
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
RUN yarn install --production --frozen-lockfile

# Define a porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["yarn", "start:prod"]
