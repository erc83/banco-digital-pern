


## 1. Clonar el proyecto

## ---------
# Backend
## ---------

- Requisitos: 
    1. tener docker desktop para levantar la base de datos en un contenedor
    2. se puede utilizar una base de datos local de postgres y se debe llenar las variables de entorno a utilizar
    3. tener psql instalado 


## 1. Hacer un cd dentro de la carpeta backend donde esta el proyecto backend

## 2. Instalar Dependencias

```bash
$ yarn install
```

## 3. Crear un archivo `.env` basado en el archivo `.env.template`

## 4. Levantar la base de datos con `docker compose up -d`

## 5. Requisito tener instalado `psql` 

- hacer un cd dentro de la carpeta backend para ejecutar el siguiente comando para el borrado de la base de datos en caso que exista y la creacion de la misma base de datos con las tablas a utilizar, revisar bien el puerto ya que en mi caso asigne el puerto 5433 en el container de las base de datos.

```
psql -h localhost -p 5433 -U postgres -d postgres -f db/script.sql
```




