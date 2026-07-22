# Imagen base oficial de Node.js en versión ligera
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia de archivos de dependencias
COPY package*.json ./

# Instalación limpia de dependencias
RUN npm install

# Copia de todo el código fuente al contenedor
COPY . .

# Puerto expuesto por el contenedor
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]
