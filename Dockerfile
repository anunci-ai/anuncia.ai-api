# 1. Usa uma imagem oficial e leve do Node.js
FROM node:20-alpine

# 2. Define a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copia os arquivos de dependências primeiro (isso deixa o processo mais rápido)
COPY package*.json ./

# 4. Instala as dependências do seu projeto
RUN npm install

# 5. Copia todo o resto do seu código para dentro do container
COPY . .

# 7. Expõe a porta que a sua API vai usar (vamos assumir 3000 por enquanto)
EXPOSE 3000

# 8. Comando para iniciar a aplicação
CMD ["npm", "start"]