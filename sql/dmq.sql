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

