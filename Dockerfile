FROM node:18

COPY . /var/www
WORKDIR /var/www

CMD npm install && npx prisma migrate dev && npm run dev

EXPOSE 3333