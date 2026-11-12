FROM node:22-slim
RUN apt-get update -qq && apt-get install -y -qq curl >/dev/null && rm -rf /var/lib/apt/lists/*
RUN useradd -m dev
USER dev
WORKDIR /home/dev
# Minimal app: a real HTTP server with one validated endpoint, a client with
# the wrong field name, and a second file that copied the same mistake.
COPY --chown=dev template /home/dev/template
COPY --chown=dev scripts /home/dev/scripts
CMD ["bash", "scripts/test.sh"]
