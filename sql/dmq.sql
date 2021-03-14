-- dmq.sql

-- using colon char to indicate that the query will use data provided by
    -- backend programming language

-- -- example:
-- INSERT INTO bsg_people (fname, lname, homeworld, age)
-- VALUES (:fnameInput, :lnameInput, :homeworld_id_from_dropdown_Input, :ageInput);



-- ////////////////////////
-- ///// FARMER PAGES /////
-- ////////////////////////

-- *************************
-- ***** plant new row *****
-- *************************

-- get crop types for select
SELECT crop_name, crop_id FROM Crop_Types;

-- add new crop row based on input
INSERT INTO Crop_Rows (crop_id, mature_date)
VALUES (:selected_crop_type_id, :dateInput);


-- ***************************
-- ***** harvest new row *****
-- ***************************

-- get crop rows for select
SELECT row_id, Crop_Rows.crop_id, mature_date, crop_name FROM Crop_Rows LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;

-- add new harvest based on input
INSERT INTO Harvests (`row_id`, `quantity_harvested`, `harvest_date`, `expiration_date`) VALUES (:selected_row_rowID, :inputQuantity, :inputHarvestDate, :inputExpirationDate);


-- *****************************
-- ***** view planted rows *****
-- *****************************

-- get crop rows (repeat of above)
SELECT row_id, Crop_Rows.crop_id, mature_date, crop_name FROM Crop_Rows LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;


-- ********************************
-- ***** view produce on hand *****
-- ********************************

-- get harvests
SELECT harvest_id, crop_name, quantity_harvested, harvest_date, expiration_date, Harvests.row_id FROM Harvests LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id;;


-- *****************************
-- ***** add new crop type *****
-- *****************************

-- get crop types
INSERT INTO Crop_Types (`crop_name`)
VALUES (:inputName);


-- *********************
-- ***** spoil row *****
-- *********************

-- get harvests linked to crop row
SELECT harvest_id, crop_name, quantity_harvested, harvest_date, expiration_date, Harvests.row_id FROM Harvests LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE Harvests.row_id = :this_row_id;

-- delete crop row
DELETE FROM Crop_Rows WHERE `row_id` = :this_row_id;


-- ///////////////////////////
-- ///// BOX PACKER PAGE /////
-- ///////////////////////////

-- get all Boxes to sort for `next Box` with js
SELECT * FROM Boxes;

-- get Boxes_Harvests entries for `next Box` (where `next Box` found using js)
SELECT box_id, Boxes_Harvests.harvest_id, qty_per, crop_name FROM Boxes_Harvests LEFT JOIN Harvests ON Boxes_Harvests.harvest_id = Harvests.harvest_id LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE `box_id` = :next_box_id;

-- update number_packed for next Box based on input
UPDATE Boxes SET `number_packed` = ? WHERE `box_id` = ?,
[:new_number_packed, :this_box_id];



-- ///////////////////////
-- ///// ADMIN PAGES /////
-- ///////////////////////

-- ***********************
-- ***** New Customer ****
-- ***********************

-- get customers already in database
SELECT * FROM Customers;

-- add customer to database
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

-- view a box
SELECT box_id, box_date
FROM Boxes
WHERE box_date = :box_date;

-- create a new box
INSERT INTO Boxes (box_id, box_date)
VALUES (:box_id, :box_date);

-- get all boxes to sort for box closest to date
SELECT * FROM Boxes;

-- get box by id
SELECT * FROM Boxes WHERE `box_id` = :box_id;

-- get box contents
SELECT box_id, Boxes_Harvests.harvest_id, qty_per, crop_name FROM Boxes_Harvests LEFT JOIN Harvests ON Boxes_Harvests.harvest_id = Harvests.harvest_id LEFT JOIN Crop_Rows ON Harvests.row_id = Crop_Rows.row_id LEFT JOIN Crop_Types ON Crop_Rows.crop_id = Crop_Types.crop_id WHERE `box_id` = :box_id;

-- get customers who will receive the box
SELECT first_name, last_name, Customers.customer_id FROM Boxes_Customers LEFT JOIN Customers ON Boxes_Customers.customer_id = Customers.customer_id WHERE `box_id` = :box_id;



-- ////////////////////////////////////////
-- ///// ALGORITHMIC AUDITING JS FILE /////
-- ////////////////////////////////////////

-- Note: this file has functions which are called from various pages to keep
--     both Boxes_Harvests and Boxes_Customers interesection tables up to date 
--     with Boxes, Harvest, Customers, and [nullified] Crop_Rows

-- get harvest with expiration_date greater than lower_limit
SELECT * FROM Harvests WHERE expiration_date >= :lower_limit;

-- get number of customers linked to box
SELECT Count(*) AS number_of_customers FROM Boxes_Customers WHERE box_id = :this_box_id;

-- get boxes between two dates
SELECT * FROM Boxes WHERE box_date BETWEEN :date0 AND :date1;

-- update Boxes_Harvests qty_per for box and harvest
UPDATE Boxes_Harvests SET `qty_per` = ? WHERE `box_id` = ? AND `harvest_id` = ?,
[:qty_per, :box_id, :harvest_id];

-- insert Boxes_Harvests link for box and harvest
INSERT INTO Boxes_Harvests (`box_id`, `harvest_id`, `qty_per`) VALUE
(:box_id, :harvest_id, :qty_per)

-- delete Boxes_Harvests link for box and harvest
DELETE FROM Boxes_Harvests WHERE `box_id` = :box_id AND `harvest_id` = :harvest_id;

-- get boxes linked to harvest
SELECT Boxes_Harvests.box_id, box_date, number_packed, qty_per FROM Boxes_Harvests LEFT JOIN Boxes ON Boxes_Harvests.box_id = Boxes.box_id WHERE harvest_id = :harvest_id;

-- insert Boxes_Customers link for box and customer
INSERT INTO Boxes_Customers (box_id,customer_id) VALUES (:box_id,:customer_id);

-- delete Boxes_Customers link for box and customer
DELETE FROM Boxes_Customers WHERE `box_id` = :box_id AND `customer_id` = :customer_id;

-- get Customer entries that could need intersections updated
SELECT * FROM Customers WHERE date_paid > :two_weeks_out;

-- get Customer entries linked to box
SELECT customer_id FROM Boxes_Customers WHERE box_id = :box_id;

-- get boxes with box_date greater than lower_limit
SELECT * FROM Boxes WHERE box_date > :lower_limit;

