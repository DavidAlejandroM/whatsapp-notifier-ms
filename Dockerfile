FROM node

WORKDIR /usr/src/app

COPY package*.json ./

# Install Chromium.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY dist .
COPY .env .

RUN npm install

RUN ls -l

# Run everything after as non-privileged user.
#RUN useradd -ms /bin/bash wppuser
#USER wppuser

EXPOSE 3000
CMD [ "node", "application/app.js" ]
