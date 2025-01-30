# Etapa de construcción
FROM node:21-alpine3.18 as builder

WORKDIR /app

# Habilita PNPM y define su ruta
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Copia archivos necesarios
COPY package*.json *-lock.yaml ./
COPY . .

# Instala dependencias y compila
RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && apk add --no-cache git \
    && pnpm install \
    && pnpm run build \
    && apk del .gyp

# Etapa de despliegue
FROM node:21-alpine3.18 as deploy

WORKDIR /app

# Define el puerto y expón un valor predeterminado
ARG PORT
ENV PORT=${PORT:-3000}
EXPOSE $PORT

# Copia los archivos necesarios desde la etapa anterior
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/*-lock.yaml ./

# Habilita PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate 
ENV PNPM_HOME=/usr/local/bin

# Instala solo dependencias de producción
RUN npm cache clean --force \
    && pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs \
    && adduser -S -u 1001 nodejs \
    && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

# Ajustar permisos para que nodejs pueda escribir en /app
RUN chown -R nodejs:nodejs /app

# Cambia al usuario seguro antes de ejecutar la app
USER nodejs

# Comando de inicio
CMD ["node", "./dist/app.js"]
