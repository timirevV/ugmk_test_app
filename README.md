# UGMK Test App

SPA на React для демонстрации графиков по данным производства продукции фабрик A и Б.

## Клонирование репозитория

SSH:
git clone git@github.com
:timirevV/ugmk_test_app.git

HTTPS:
git clone https://github.com/timirevV/ugmk_test_app.git

Перейти в папку проекта:
cd ugmk_test_app

## Установка зависимостей

npm install

## Запуск проекта локально

npm run start

Откроется в браузере по адресу: http://localhost:3000

Перед запуском убедитесь, что на порту 3001 запущен mock сервер json-server:
json-server --watch products.json --port 3001

## Сборка проекта

npm run build

## Запуск через Docker

Сборка Docker-образа:
npm run dockerize

Запуск контейнера:
npm run start-container

Проект будет доступен по адресу: http://localhost:3000

Контейнер автоматически удаляется после завершения работы.
