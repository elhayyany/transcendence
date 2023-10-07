#!/bin/sh
sleep 5
npx prisma migrate dev --name init
npm run start:dev