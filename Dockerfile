FROM node:15.11-slim

WORKDIR /app

ARG INST_ARGS
ENV INSTALL_ARGS=$INST_ARGS

ARG TIMESTAMP
ENV BUNDLE_PREFIX=$TIMESTAMP

RUN groupadd -r search
RUN useradd -ms /bin/bash -g search search
RUN chown search:search .

RUN apt-get update || : && apt-get install -y python python-pip jq unzip curl git nginx

# Due to the outdated version of awscli in upstream repos, manually install latest from Amazon.
RUN curl --silent --show-error --fail "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
      unzip awscliv2.zip && \
      ./aws/install && \
      rm -rf awscliv2.zip

COPY --chown=search:search package.json package-lock.json ./
RUN npm install $INSTALL_ARGS
RUN npm run build

# tx client
RUN pip install --upgrade transifex-client

COPY --chown=search:search . .

EXPOSE 8001
CMD ["/bin/bash", "docker-entrypoint.sh"]
