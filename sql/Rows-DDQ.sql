-- Rows-DDQ.sql
--
-- Create a table with the following columns & relationships, named Rows
--
    -- row_id: INT, auto_increment, unique, not NULL, PK
    -- crop_id: VARCHAR, not NULL, FK
    -- mature_date: DATE, not NULL
    -- Relationship: a mandatory 1:M relationship between Crop_types and Rows is implemented with crop_id as a FK inside of Rows
--
--
--

CREATE TABLE Rows(
    row_id INT NOT NULL AUTO_INCREMENT,
    crop_id INT,
    mature_date DATE NOT NULL,
    PRIMARY KEY (row_id),
    FOREIGN KEY fk_crop(crop_id)
        REFERENCES Crop_Types(crop_id)
        ON DELETE SET NULL
        -- ON UPDATE CASCADE -- ??
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
