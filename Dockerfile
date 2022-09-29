# set the base image to Debian
# https://hub.docker.com/_/debian/
FROM debian:latest
# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get install -y apache2 \
    && apt-get install -y vim \
    && apt-get install -y apache2-utils \
    && apt-get -y autoclean
# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 16.13.2
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV ANGULAR_VERSION ^13.2.0
#ENV APACHE_RUN_DIR /var/www
# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
# install angular and npm
RUN npm i -g pm2
#RUN npm i -g typescript
RUN npm i -g @angular/cli@$ANGULAR_VERSION pm2
RUN npm i -g @ionic/cli pm2
# confirm installation
RUN node -v
RUN npm -v
RUN ng --version
RUN pm2 install typescript
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2enmod proxy_balancer
#RUN echo $APACHE_RUN_DIR
EXPOSE 80 443
CMD ["/usr/sbin/apache2ctl", "-DFOREGROUND"]
