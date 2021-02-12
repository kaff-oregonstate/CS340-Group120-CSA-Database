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

-- not sure if this works either
INSERT INTO Harvests
(harvest_date, expiration_date, row_id)
VALUES('2021-04-05', '2021-05-22', (SELECT row_id FROM Rows WHERE mature_date = '2021-04-05' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Carrots')));

INSERT INTO Harvests
(harvest_date, expiration_date, row_id)
VALUES('2021-03-22', '2021-05-22', (SELECT row_id FROM Rows WHERE mature_date = '2021-03-22' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Potatoes')));

INSERT INTO Harvests
(harvest_date, expiration_date, row_id)
VALUES('2021-05-01', '2021-06-01', (SELECT row_id FROM Rows WHERE mature_date = '2021-05-01' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Asparagus')));

