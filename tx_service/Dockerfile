# syntax=docker/dockerfile:1

FROM python:3.9 as build

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "gunicorn", "--bind", "0.0.0.0:5000", "app:app"]