FROM mdillon/postgis:9.6

RUN apt-get update && apt-get -y install curl apt-transport-https
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN  apt-get install nodejs

RUN apt-get install postgresql-9.6-postgis-2.4 -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get -y install yarn

RUN apt-get install gdal-bin

ADD . /app
WORKDIR /app
RUN yarn


CMD ["yarn", "start"]
