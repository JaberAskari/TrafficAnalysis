# Use the following command when you want to build the image to aida2.labranet.jamk.fi server
# docker build --build-arg server_url=https://aida2.labranet.jamk.fi/lam --build-arg url_path_prefix="/lam" --build-arg public_url="https://aida2.labranet.jamk.fi/lam" -t lam-frontend .

FROM node:12 as build

ARG server_url
ARG url_path_prefix
ARG public_url
ENV REACT_APP_SERVER_URL=$server_url
ENV REACT_APP_URL_PATH_PREFIX=$url_path_prefix
ENV PUBLIC_URL=$public_url

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
