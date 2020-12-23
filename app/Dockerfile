# # This step requires 4096MB of memory for docker VMs
FROM node:12 as build
WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./
RUN yarn
COPY ./frontend ./
RUN yarn build

FROM python:3.8
WORKDIR /app
COPY ./backend .
RUN python3 -m venv venv
RUN pip3 install -r requirements.txt
RUN . venv/bin/activate
COPY --from=build /app/frontend/build ./static

EXPOSE 5000
CMD python3 server.py
