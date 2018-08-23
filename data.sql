CREATE TABLE people
(
    name character varying(200),
    address character varying(200),
    email character varying(200),
    phone character varying(10),
    id integer unique not null
);

INSERT INTO people (name, address, email, phone, id)
VALUES
('bilbo', 'the Shire', 'bilbo@gmail.com', '3333333333', 3);