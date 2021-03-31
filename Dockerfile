FROM node:15.11-slim

WORKDIR /app

RUN groupadd -r search
RUN useradd -ms /bin/bash -g search search
RUN chown search:search .

COPY --chown=search:search package.json package-lock.json ./
RUN npm install

COPY --chown=search:search . .

EXPOSE 8001
CMD ["/bin/bash", "docker-entrypoint.sh"]
