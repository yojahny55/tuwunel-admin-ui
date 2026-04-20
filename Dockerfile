FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend/src ./backend/src
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY package*.json ./

EXPOSE 3001
CMD ["node", "backend/src/index.js"]
