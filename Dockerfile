FROM node:16

WORKDIR /usr/src/app

RUN pwd
RUN mkdir -p /opt/oracle
RUN cd /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linuxx64.zip
RUN unzip instantclient-basic-linuxx64.zip
RUN ln -s instantclient_21_5/libclntsh.so.21.1 instantclient_21_5/libclntsh.so
RUN ln -s instantclient_21_5/libocci.so.21.1 libocci.so
#RUN ldconfig
#RUN cd /usr/src/app

COPY package*.json ./



RUN npm install

COPY . .

RUN ls -l

EXPOSE 3010
#CMD [ "node", "dist/application/app.js" ]
CMD [ "ls", "-l","instantclient_21_5" ]
