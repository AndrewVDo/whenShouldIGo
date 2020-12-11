FROM python:3.8

ENV FLASK_APP server.py
ENV FLASK_ENV development

WORKDIR /app
COPY . .

RUN python3 -m venv venv
RUN pip3 install -r requirements.txt
RUN . venv/bin/activate

RUN cc -fPIC -shared -o calculate.so calculate.c

EXPOSE 5000

CMD flask run --host=0.0.0.0
