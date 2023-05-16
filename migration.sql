
DROP TABLE IF EXISTS monday;
DROP TABLE IF EXISTS tuesday;
DROP TABLE IF EXISTS wednesday;
DROP TABLE IF EXISTS thursday;
DROP TABLE IF EXISTS friday;
DROP TABLE IF EXISTS saturday;
DROP TABLE IF EXISTS sunday;


CREATE TABLE monday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'monday'
);

CREATE TABLE tuesday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'tuesday'
);

CREATE TABLE wednesday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'wednesday'
);

CREATE TABLE thursday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'thursday'
);

CREATE TABLE friday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'friday'
);

CREATE TABLE saturday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'saturday'
);

CREATE TABLE sunday (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN NOT NULL,
  day TEXT NOT NULL DEFAULT 'sunday'
);



INSERT INTO monday (task, completed) VALUES ('Mow the lawn', false);
INSERT INTO tuesday (task, completed) VALUES ('Wash the dishes', true);
INSERT INTO wednesday (task, completed) VALUES ('Go to the gym', true);
INSERT INTO thursday (task, completed) VALUES ('Touch grass', true);
INSERT INTO friday (task, completed) VALUES ('Clean room', false);
