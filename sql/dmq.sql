-- dmq.sql

-- using colon char to indicate that the query will use data provided by
    -- backend programming language

-- -- example:
-- INSERT INTO bsg_people (fname, lname, homeworld, age)
-- VALUES (:fnameInput, :lnameInput, :homeworld_id_from_dropdown_Input, :ageInput);

-- 'plant new row' page
SELECT crop_name, crop_id FROM Crop_Types;

INSERT INTO Crop_Rows (crop_id, mature_date)
VALUES (:selected_crop_type_id, :dateInput);


-- 'harvest new row' page
SELECT * FROM Crop_Rows;

INSERT INTO Harvests (row_id, harvest_date, expiration_date, quantity)
VALUES (:selected_row_rowID, :inputHarvestDate, :inputExpirationDate, :inputQuantity);


-- 'view planted rows' page
SELECT * FROM Crop_Rows;


-- 'view produce on hand' page
SELECT * FROM Harvests;


-- 'add new crop type' page
SELECT crop_name FROM Crop_Types;

INSERT INTO Crop_Types (crop_name)
VALUES (:inputName);

-- ///////////////////////
-- ADMIN PAGES
-- ///////////////////////

-- ***********************
-- ***** New Customer ****
-- ***********************

INSERT INTO Customers (customer_id, first_name, last_name, date_paid)
VALUES (:customer_id, :first_name, :last_name, :date_paid);

-- *******************************
-- ***** Update Subscription *****
-- *******************************

-- find customer id for customer with specific first name last name and subscription start date, so that
-- customer's information can be updated or deleted
SELECT customer_id
FROM Customers
WHERE :first_name = first_name, :last_name = :last_name , :date_paid = date_paid;

-- Update rows in table 'Customers'
UPDATE Customers
SET
    first_name = :first_name,
    last_name = :last_name,
    date_paid = :date_paid

    -- add more columns and values here
WHERE customer_id = :customer_id;


-- Delete rows from table 'Customers'
DELETE FROM Customers
WHERE customer_id = :customer_id;

-- ***************************
-- **** View & Create Box ****
-- ***************************

--view a box
SELECT box_id, box_date
FROM Boxes
WHERE :box_date = box_date;

-- create a new box
INSERT INTO Boxes (box_id, box_date)
VALUES (:box_id, :box_date);






