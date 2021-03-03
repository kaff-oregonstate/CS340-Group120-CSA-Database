// updateB_H.js

// TODO: function today()
// TODO: function get_next_box()
// TODO: **change "qty" in Harvests into "qty_harvested", & add "qty_left" INT
// TODO: **add "qty_per" INT to Boxes_Harvests
// TODO: **add "num_packed" INT Boxes


function get_next_box_helper(results) {
    var today = new Date();
    for (r in results) {
        var box_date = new Date(r.box_date);
        if (box_date > today) { return r; }
    }
    return NULL;
}


function get_next_box() {
    // get all boxes
    pool.query(
        "SELECT * FROM Boxes",
        function(err, result){ return get_next_box_helper(results); }
    )
}


function get_relevant_harvests() {
    return [];
}


function UPDATE_boxes_harvests_ALGORITHM() {

    // do this function for any Harvest which are relavent to reallocate:
        // this would be anything going into the box after next
        // that box will be 7 days after the next_box
        // that box will only have produce which will be good (not expired) for 7 days past box_date
        // Therefore: (next_box.box_date + 14) and older is excluded


    let next_box = get_next_box();
    console.log(next_box);


    let harvests = get_relevant_harvests();
    relevant_harvests.append(SELECT from Harvests WHERE expiration_date > :(next_box.box_date + 14));


    // for each of the relavent Harvest entries:
    for h in relevant_harvests{ 

        // keep track of how much produce we have to spread between future boxes
        let working_qty = h.qty _left;

        // make a list of the boxes we have already allocated this harvest into
        let curr = [];
        curr.append(SELECT from Boxes_Harvests WHERE harvest_id == :h.harvest_id );

        // check the contents of the above list, and update 'working_qty' according to previous distributions
        for c in curr  {

            // get the date of box in question
            c_box_date = SELECT box_date FROM Boxes WHERE Boxes.box_id == :c.box_date;

            // if box is over a week out, we can still change the contents [do nothing]
            if (c_box_date > (today() + 7)) {
                continue;
            }

            // if the box is less than a week out, we can no longer change the contents, but the qty may not yet be subtracted for the Harvest entry's qty_left. Ensure that working_qty is accurate, and remove box from list of boxes to update
            else if (c_box_date >= today()) {
                // if more customers than already packed boxes, can expect more boxes to be packed (and that amount of harvest to be subtracted from total) (so leave it to be subtracted this week, don't allow it to weigh into this function's reallocation)
                allocated = c.qty_per * ((SELECT Count(*) from Boxes_Customers WHERE box_id == :c.box_id) - (SELECT num_packed from Boxes WHERE box_id == :c.box_id));
                working_qty -= allocated;
                curr.remove(c);
            }

            // if the box is already delivered, we can no longer change the contents (but we can be sure the amount deducted from Harvest entry's qty_left is final), so remove from list of boxes to update
            else {curr.remove(c);} 
        }

        // set the calendar window bounds
        let date0 = today() + 7;
        let date1 = h.expiration_date - 7;

        // get ALL the Boxes entries within the calendar window
        let relevant_boxes = [];
        relevant_boxes.append(SELECT * from Boxes WHERE boxes_date > :date0 AND boxes_date < :date1)

        // How many individual boxes in the window will have this harvest?
            // sum(num of cust in each box) for baseline number to service in window
        let custPerRelevantBox = [];
        for b in relevant_boxes{
            custPerRelevantBox.append(SELECT Count(*) from Boxes_Customers WHERE box_id == :b.box_id)
        }
        let baseService = 0;
        for count in custPerRelevantBox {
            baseService += count;
        }

        // calc the minimum qty (baseLevel) to put in each individual box
        baseLevel = working_qty % baseService;
        working_qty = working_qty - (baseLevel * baseService);

        // update qty/create rltnshp with qty
        for b relevant_boxes{
            // if there is already a Boxes_Harvests entry, update
            if (b in curr) {
                // if we have enough to add an extra to each box, do it
                if (working_qty > custPerRelevantBox[b]){
                    UPDATE Boxes_Harvests
                        SET qty_per = :(baseLevel + 1)
                        WHERE box_id == :b.box_id
                        AND harvest_id = :h.harvest_id;
                    working_qty -= custPerRelevantBox[b];
                }
                // otherwise add the base amount
                else {
                    UPDATE Boxes_Harvests
                        SET qty_per = :baseLevel
                        WHERE box_id == :b.box_id
                        AND harvest_id = :h.harvest_id;
                }
            }
            // if no Boxes_Harvests entry yet, INSERT
            else {
                // if we have enough to add an extra to each box, do it
                if (working_qty > custPerRelevantBox[b]){
                    INSERT INTO Boxes_Harvests
                        (box_id, harvest_id, qty_per)
                        VALUES (:b.box_id, :h.harvest_id;, (:baseLevel + 1));
                    working_qty -= custPerRelevantBox[b];
                }
                // otherwise add the base amount
                else {
                    INSERT INTO Boxes_Harvests
                        (box_id, harvest_id, qty_per)
                        VALUES (:b.box_id, :h.harvest_id;, (:baseLevel));
                }
            }
        }
    }
}