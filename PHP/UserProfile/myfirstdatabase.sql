CREATE DATABASE IF NOT EXISTS myfirstdatabase;
USE myfirstdatabase;
CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
SELECT *
FROM users;
CREATE TABLE IF NOT EXISTS profiles (
    profiles_id int NOT NULL AUTO_INCREMENT,
    profiles_about TEXT NOT NULL,
    profiles_introtitle TEXT NOT NULL,
    profiles_introtext TEXT NOT NULL,
    users_id int,
    PRIMARY KEY (profiles_id),
    FOREIGN KEY (users_id) REFERENCES users(id)
);