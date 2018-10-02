-- create database
DROP DATABASE IF EXISTS pw_info3130_a3;
CREATE DATABASE pw_info3130_a3;

-- use database
USE pw_info3130_a3;

-- create tables
CREATE TABLE choice(
    id              INT             AUTO_INCREMENT      UNIQUE,
    choice          VARCHAR(20)     NOT NULL,
    CONSTRAINT pk_choice PRIMARY KEY (id)
);

CREATE TABLE story(
    id              INT             AUTO_INCREMENT      UNIQUE,
    title           VARCHAR(50),
    body            VARCHAR(200)    NOT NULL,
    CONSTRAINT pk_story PRIMARY KEY (id)
);

CREATE TABLE storyChoice(
    storyId         INT             NOT NULL,
    choiceId        INT             NOT NULL,
    CONSTRAINT pk_storyChoice PRIMARY KEY (storyId, choiceId),
    CONSTRAINT fk_storyChoice_story FOREIGN KEY (storyId) REFERENCES story (id),
    CONSTRAINT fk_storyChoice_choice FOREIGN KEY (choiceId) REFERENCES choice (id)
);

CREATE TABLE player(
    id              INT             AUTO_INCREMENT      UNIQUE,
    name            VARCHAR(50),
    phoneNumber     VARCHAR(20)     NOT NULL,
    storyProgress   INT             NOT NULL,
    CONSTRAINT pk_player PRIMARY KEY (id),
    CONSTRAINT fk_player_story FOREIGN KEY (storyProgress) REFERENCES story (id)
);

-- insert data
INSERT INTO choice(id, choice) VALUES
(DEFAULT, '%any%'),
(DEFAULT, 'yes'),
(DEFAULT, 'no');

INSERT INTO story(id, title, body) VALUES
(DEFAULT, 'get name', 'Hello! Welcome to -game-. What is your name?'),
(DEFAULT, 'confirm', 'Wow, %name%. What a great name!'),
(DEFAULT, 'test1', 'say yes'),
(DEFAULT, 'begin1', 'story'),
(DEFAULT, 'begin2', 'more story');

INSERT INTO storyChoice(storyId, choiceId) VALUES
(1, 1),
(3, 2);
