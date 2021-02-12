-- Boxes_Harvests-DDQ.sql
--
-- Create a table with the following columns & relationships, named Boxes_Harvests
--
    -- harvest_id: FK, indicates that a harvested crop is in a box
    -- box_id: FK, indicates the particular box that a harvest crop will be in
    -- Relationship: a 1:M relationship between Boxes_Harvests and Boxes, with box_id as a FK inside Boxes_Harvests
    -- Relationship: a 1:M relationship between Boxes_Harvests and Harvests, with harvest_id as a FK inside Boxes_Harvests
--
--
--

CREATE TABLE Boxes_Harvests(
    harvest_id INT NOT NULL,
    box_id INT NOT NULL,
    PRIMARY KEY (harvest_id, box_id),
    FOREIGN KEY fk_harv(harvest_id)
        REFERENCES Harvests(harvest_id)
        ON DELETE CASCADE,
    FOREIGN KEY fk_box(box_id)
        REFERENCES Boxes(box_id)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

