-- Harvests-DDQ.sql
--
-- Create a table with the following columns & relationships, named Harvests
--
    -- harvest_id: INT, auto_increment, unique, not NULL, PK
    -- row_id: INT, not NULL, FK
    -- harvest_date: DATE, not NULL
    -- expiration_date: DATE, not NULL
    -- quantity: INT, not NULL
    -- Relationship: a 1:1 relationship between Rows and Harvests is implemented with row_id as a FK inside of Harvests
--
--
--

CREATE TABLE Harvests(
    harvest_id INT NOT NULL AUTO_INCREMENT,
    row_id INT,
    harvest_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    quantity INT NOT NULL,
    -- units VARCHAR(255), -- where none is assumed whole produce but "baskets" or "kg" can be informative, for say berries or quinoa
    PRIMARY KEY (harvest_id),
    FOREIGN KEY fk_crop(row_id)
        REFERENCES Rows(row_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

