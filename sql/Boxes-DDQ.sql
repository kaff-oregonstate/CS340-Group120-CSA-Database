-- Boxes-DDQ.sql
--
-- Create a table with the following columns, named Boxes
--
    -- box_id: INT, PK, auto_increment
    -- box_date: DATE, not NULL

CREATE TABLE Boxes(
    box_id INT NOT NULL AUTO_INCREMENT,
    box_date DATE NOT NULL,
    PRIMARY KEY (box_id)
);

