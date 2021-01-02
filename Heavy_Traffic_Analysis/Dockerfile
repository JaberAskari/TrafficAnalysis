FROM node:12

# node:12 base image includes python3 but doesn't have pip
RUN apt-get update && \
	apt-get install -y python3-pip

# Change python symbolic link to point to python3 binary
RUN rm /usr/bin/python && \
	ln -s  python3 /usr/bin/python

RUN useradd -d /usr/src/backend -m -s /bin/bash backend

USER backend

RUN	mkdir /usr/src/backend/python && \
	mkdir /usr/src/backend/node

WORKDIR /usr/src/backend/python
COPY python/ ./

RUN pip3 install --user -r requirements.txt

# See https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
WORKDIR /usr/src/backend/node
COPY backend/package*.json ./

RUN npm install
COPY backend/ ./

EXPOSE 3030

CMD ["node", "index.js"]
