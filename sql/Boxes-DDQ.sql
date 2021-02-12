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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- inserting sample data into boxes

INSERT INTO Boxes
    (box_date)
VALUES
    ('1999-02-28'),
    ('2005-05-08'),
    ('2020-07-12'),
    ('2020-07-19'),
    ('2020-07-26'),
    ('2020-08-02'),
    ('2020-08-09');


-- data manipulation queries for Boxes table

--js variable definition for inserting into Boxes

-- INSERT INTO Boxes
--     (box_date)
-- VALUES(?);