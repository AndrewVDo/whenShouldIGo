FROM python:3.8

ENV FLASK_APP server.py

WORKDIR /app
COPY . .

RUN python3 -m venv venv
RUN pip3 install -r requirements.txt
RUN . venv/bin/activate

EXPOSE 5000

CMD flask run --host=0.0.0.0
