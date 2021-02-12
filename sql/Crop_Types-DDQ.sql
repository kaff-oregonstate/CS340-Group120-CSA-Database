-- Crop_Types-DDQ.sql
--
-- Create a table with the following columns, named Crop_Types
--
    -- crop_id: INT, auto_increment, unique, not NULL, PK
    -- crop_name: VARCHAR, not NULL, unique
--
--
--

CREATE TABLE Crop_Types(
    crop_id INT NOT NULL AUTO_INCREMENT,
    crop_name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (crop_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO Crop_Types
(crop_name)
VALUES('Carrots');
INSERT INTO Crop_Types
(crop_name)
VALUES('Potatoes');
INSERT INTO Crop_Types
(crop_name)
VALUES('Asparagus');
