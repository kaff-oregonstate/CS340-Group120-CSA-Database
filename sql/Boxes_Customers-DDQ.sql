-- Boxes_Customers-DDQ.sql
--
-- Create a table with the following columns & relationships, named Boxes_Customers
--
    -- box_id: FK
    -- customer_id: FK
    -- Relationship: a 1:M relationship between Boxes_Customers and Boxes, with box_id as a FK inside Boxes_Customers
    -- Relationship: a 1:M relationship between Boxes_Customers and Customers, with customer_id as a FK inside Boxes_Customers
--
--
-- intersection table between boxes and customers

CREATE TABLE Boxes_Customers(
    box_id INT NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY fk_box(box_id)
        REFERENCES Boxes(box_id)
        ON DELETE CASCADE,
    FOREIGN KEY fk_customer(customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE CASCADE,
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


