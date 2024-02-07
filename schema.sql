CREATE DATABASE IF NOT EXISTS compras_selo_app;
USE compras_selo_app;

CREATE TABLE IF NOT EXISTS users (
    id int(11) NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    tokens int(11) NOT NULL DEFAULT 0,
    username varchar(25) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    price int(11) NOT NULL,
    PRIMARY KEY (id)
);