# Usa la imagen oficial de Node.js
FROM node:18-bullseye

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Instala herramientas de compilación
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --build-from-source

# Copia el resto del código de la aplicación
COPY . .

# Recompila módulos nativos (específicamente bcrypt)
RUN npm rebuild bcrypt --build-from-source

# Expone el puerto de la aplicación
EXPOSE 3012

# Comando para ejecutar la aplicación
CMD ["npm", "start"]