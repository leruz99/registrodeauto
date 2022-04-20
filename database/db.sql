CREATE DATABASE carUTB;

USE carutb;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
    id INT(11) NOT NULL,
    name VARCHAR(16) NOT NULL,
    password VARCHAR(250) NOT NULL,
    email VARCHAR(100) NOT NULL,
    tipo varchar(255) ,
    description VARCHAR(250)
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');

SELECT * FROM users;

-- LINKS TABLE
CREATE TABLE cars (
  id INT(11) NOT NULL,
  placa VARCHAR(150) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE cars
  ADD PRIMARY KEY (id);

ALTER TABLE cars
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;