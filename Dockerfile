# FROM node:6.11

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json .
# # For npm@5 or later, copy package-lock.json as well
# # COPY package.json package-lock.json ./
# COPY yarn.lock .

# RUN yarn

# # Bundle app source
# COPY . .

# RUN ls -al

# EXPOSE 8081

# CMD [ "yarn", "start:prod" ]

# FROM node:6.11
# MAINTAINER Samuel Imolorhe

# WORKDIR /usr/src/app

# ADD package.json yarn.lock /tmp/
# RUN cd /tmp && yarn
# RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /tmp/node_modules

# # Bundle app source
# COPY . /usr/src/app

# RUN ls -al

# EXPOSE 8081

# CMD [ "yarn", "start:prod" ]

FROM node:6.11

WORKDIR /usr/src/app

ADD . /usr/src/app/

RUN yarn

RUN yarn build

RUN ls -al

EXPOSE 8081

CMD [ "yarn", "start:docker:prod" ]