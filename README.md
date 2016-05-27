Install :

	npm install

	./start



DDL table oracle :

CREATE TABLE users( 
	id NUMBER NOT NULL,
  	username VARCHAR(50) NOT NULL,
  	password VARCHAR(80),
  	akses VARCHAR(15),
  	CONSTRAINT users_pk PRIMARY KEY (id)
);

CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER users_trigger
BEFORE INSERT ON users
REFERENCING NEW AS NEW
FOR EACH ROW
BEGIN
SELECT users_seq.nextval INTO :NEW.ID FROM dual;
END;

select * from ais_position_report where tanggal between to_date('2016-3-1','YYYY-MM-DD') and to_date('2016-3-31','YYYY-MM-DD');