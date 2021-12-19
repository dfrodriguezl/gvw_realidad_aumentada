FROM node:12

RUN npm install pm2 -g

COPY dist dist
COPY backend backend

CMD ["pm2-runtime", "backend/server.bundle.js","--json"]
