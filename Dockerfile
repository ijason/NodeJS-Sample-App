FROM node:0.10.40

COPY ./EmployeeDB /app

ENTRYPOINT node /app/app.js
