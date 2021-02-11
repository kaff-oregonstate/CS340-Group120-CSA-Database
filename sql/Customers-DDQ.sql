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
);
--


