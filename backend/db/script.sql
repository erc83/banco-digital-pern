-- Creación y conexión de la base de datos

DROP DATABASE IF EXISTS bank_db;

CREATE DATABASE bank_db;
\c bank_db;

-- CREACIÓN DE TABLAS

CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    account INT NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE, 
    rut VARCHAR(12) NOT NULL UNIQUE, 
    address VARCHAR(100) NOT NULL, 
    password VARCHAR(70) NOT NULL, 
    balance FLOAT NOT NULL CHECK (balance >= 0)
);

CREATE TABLE transfers (
    id SERIAL PRIMARY KEY, 
    date TIMESTAMP NOT NULL, 
    id_from INT NOT NULL, 
    id_to INT NOT NULL, 
    comment VARCHAR(50) NOT NULL, 
    amount FLOAT NOT NULL, 
    FOREIGN KEY (id_from) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY (id_to) REFERENCES users(id) ON DELETE CASCADE
);

-- ALTER TABLE transferencias DROP CONSTRAINT id_from;
