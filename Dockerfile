# Imagem de produção do GameVault
FROM node:20

WORKDIR /app
ENV NODE_ENV=production

# Instala apenas as dependências de produção (sem mocha/jest)
COPY package*.json ./
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

# Pasta onde o multer grava as imagens enviadas
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "server.js"]
