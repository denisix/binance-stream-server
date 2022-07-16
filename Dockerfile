FROM node:16-slim

WORKDIR /app
COPY *.js *.json server.key server.crt /app/
RUN npm ci --no-audit --no-scripts

FROM gcr.io/distroless/nodejs:16
COPY --from=0 --chown=nonroot:nonroot /app /app
WORKDIR /app
USER nonroot

CMD [ "server.js" ]
