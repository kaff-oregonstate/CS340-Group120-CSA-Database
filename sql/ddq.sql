-- **********   ddq.sql ************
-- contains table definitions & adds sample data for CSA DATABASE


-- /////////////////////  TABLES ///////////////////////

-- Boxes DEFINTION

CREATE TABLE Boxes(
    box_id INT NOT NULL AUTO_INCREMENT,
    box_date DATE NOT NULL UNIQUE,
    number_packed INT DEFAULT 0,
    PRIMARY KEY (box_id)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Crop_Type DEFINITION

CREATE TABLE Crop_Types(
    crop_id INT NOT NULL AUTO_INCREMENT,
    crop_name VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (crop_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Crop_Rows DEFINITION

CREATE TABLE Crop_Rows(
    row_id INT NOT NULL AUTO_INCREMENT,
    crop_id INT,
    mature_date DATE NOT NULL,
    PRIMARY KEY (row_id),
    FOREIGN KEY fk_crop_cr(crop_id)
        REFERENCES Crop_Types(crop_id)
        ON DELETE SET NULL
        -- ON UPDATE CASCADE -- ??
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Customers DEFINITION

CREATE TABLE Customers
(
    customer_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_paid DATE NOT NULL,
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Harvests DEFINITION

CREATE TABLE Harvests(
    harvest_id INT NOT NULL AUTO_INCREMENT,
    row_id INT,
    harvest_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    quantity_harvested INT NOT NULL,
    quantity_distributed INT DEFAULT 0,
    -- units VARCHAR(255), -- where none is assumed whole produce but "baskets" or "kg" can be informative, for say berries or quinoa
    PRIMARY KEY (harvest_id),
    FOREIGN KEY fk_crop_h(row_id)
        REFERENCES Crop_Rows(row_id)
        ON DELETE SET NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Boxes_Customers DEFINITION

CREATE TABLE Boxes_Customers(
    box_id INT NOT NULL,
    customer_id INT NOT NULL,
    PRIMARY KEY (box_id, customer_id),
    FOREIGN KEY fk_box_bc(box_id)
        REFERENCES Boxes(box_id)
        ON DELETE CASCADE,
    FOREIGN KEY fk_customer(customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Boxes_Harvests DEFINITION

CREATE TABLE Boxes_Harvests(
    harvest_id INT NOT NULL,
    box_id INT NOT NULL,
    qty_per INT DEFAULT 0,
    PRIMARY KEY (box_id, harvest_id),
    FOREIGN KEY fk_harv(harvest_id)
        REFERENCES Harvests(harvest_id)
        ON DELETE CASCADE,
    FOREIGN KEY fk_box_bh(box_id)
        REFERENCES Boxes(box_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ////////////////////////// SAMPLE DATA ///////////////////////////

-- Boxes SAMPLE DATA

INSERT INTO Boxes
    (box_date)
VALUES
    ('1999-02-28'),
    ('2005-05-08'),
    ('2021-07-12'),
    ('2021-07-19'),
    ('2021-07-26'),
    ('2021-08-02'),
    ('2021-08-09'),
    ('2021-03-03'),
    ('2021-03-10'),
    ('2021-03-17');

-- js variable definition for inserting into Boxes

-- INSERT INTO Boxes
--     (box_date)
-- VALUES(?);

-- Crop_Type SAMPLE DATA

INSERT INTO Crop_Types
(crop_name)
VALUES('Carrots'),
      ('Potatoes'),
      ('Asparagus'),
      ('Broccoli'),
      ('Corriander'),
      ('Rainbow Chard'),
      ('Garnet Yams'),
      ('Daffodils');

-- Crop_Rows SAMPLE DATA

INSERT INTO Crop_Rows
(mature_date, crop_id)
VALUES('2021-04-05', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Carrots')),
      ('2021-03-22', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Potatoes')),
      ('2021-05-01', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Asparagus')),
      ('2021-01-01', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Broccoli')),
      ('2021-01-16', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Corriander')),
      ('2021-02-28', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Rainbow Chard')),
      ('2021-02-03', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Garnet Yams')),
      ('2021-01-08', (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Daffodils'));

-- Customers SAMPLE DATA

-- js variable definition for inserting into customers

-- INSERT INTO Customers
--     (first_name, last_name, date_paid)
-- VALUES(?,?,?);

INSERT INTO Customers
    (first_name, last_name, date_paid)
VALUES
    ('Charlie', 'Lopez', '2021-03-05'),
    ('Justice', 'Davis', '2021-12-15'),
    ('Finley', 'Brown', '2021-04-17'),
    ('Emerson', 'Sullivan', '2021-06-27'),
    ('River', 'Reynolds', '2021-10-18'),
    ('Quinn', 'Romero', '2021-05-09'),
    ('Rory', 'Castillo', '2021-07-24'),
    ('Venus', 'Bassi', '2021-09-07'),
    ('Shae', 'Kim', '2021-11-26');

-- Harvests SAMPLE DATA

INSERT INTO Harvests
(harvest_date, expiration_date, row_id, quantity_harvested)
VALUES('2021-04-05', '2021-07-22', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-04-05' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Carrots')), 80),
      ('2021-03-22', '2021-11-22', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-03-22' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Potatoes')), 654),
      ('2021-05-01', '2021-06-22', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-05-01' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Asparagus')), 203),
      ('2021-01-01', '2021-03-18', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-01-01' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Broccoli')), 408),
      ('2021-01-16', '2021-04-24', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-01-16' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Corriander')), 326),
      ('2021-02-28', '2021-04-03', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-02-28' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Rainbow Chard')), 97),
      ('2021-02-03', '2021-08-06', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-02-03' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Garnet Yams')), 421),
      ('2021-01-08', '2021-05-30', (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-01-08' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Daffodils')), 254);

-- Boxes_Customers SAMPLE DATA

INSERT INTO Boxes_Customers
    (box_id,customer_id)
VALUES
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 1 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 2 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 3 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 5 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 6 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 7 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 8 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), 9 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-19'), 5 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-19'), 6 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-19'), 7 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-19'), 8 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-26'), 8 ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-26'), 9 );

-- INSERT INTO Boxes_Harvests
--     (box_id, harvest_id)
-- VALUES(?,?);

-- Boxes_Harvests SAMPLE DATA

INSERT INTO Boxes_Harvests
(box_id, harvest_id)
VALUES((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), (SELECT harvest_id FROM Harvests WHERE row_id = (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-03-22' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Potatoes'))) ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), (SELECT harvest_id FROM Harvests WHERE row_id = (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-04-05' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Carrots'))) ),
    ((SELECT box_id FROM Boxes WHERE box_date = '2021-07-12'), (SELECT harvest_id FROM Harvests WHERE row_id = (SELECT row_id FROM Crop_Rows WHERE mature_date = '2021-05-01' AND crop_id = (SELECT crop_id FROM Crop_Types WHERE crop_name = 'Asparagus'))) );
