-- Customers-DDQ.sql
--
-- Create a table with the following columns, named Customers
--
    -- customer_id: INT, auto_increment, unique, not NULL, PK
    -- first_name: VARCHAR, not NULL
    -- last_name: VARCHAR, not NULL
    -- date_paid: DATE, not NULL
--
CREATE TABLE Customers
(
    customer_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_paid DATE NOT NULL,
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Inserting sample data into the customers table

INSERT INTO Customers
    (first_name, last_name, date_paid)
VALUES
    ('Charlie', 'Lopez', '2009-03-05'),
    ('Justice', 'Davis', '2015-12-15'),
    ('Finley', 'Brown', '1999-01-17'),
    ('Emerson', 'Sullivan', '2002-06-27'),
    ('River', 'Reynolds', '2017-10-18'),
    ('Quinn', 'Romero', '2020-05-09'),
    ('Rory', 'Castillo', '2000-07-24'),
    ('Venus', 'Bassi', '2006-09-07'),
    ('Shae', 'Kim', '1998-11-26');

-- data manipulation queries for customer table

--js variable definition for inserting into customers

-- INSERT INTO Customers
--     (first_name, last_name, date_paid)
-- VALUES(?,?,?);

