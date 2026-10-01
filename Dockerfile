FROM node:22-bookworm-slim AS build

WORKDIR /app

ENV CI=1 \
    EXPO_NO_TELEMETRY=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Public URL of the chat proxy. Not a secret; the API key never enters this image.
ARG EXPO_PUBLIC_API_URL=http://localhost:8787
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
RUN rm -f .env && npx expo export --platform web

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
