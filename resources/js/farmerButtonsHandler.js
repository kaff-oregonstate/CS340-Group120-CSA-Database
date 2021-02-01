// farmerButtonsHandler.js

// this file will do all the page restructuring and SQL for the farmer page

function plantNewRow() {
    console.log('plantNewRow()');
    app.get('/farmer-plantNewRow', funcFarmerNewPlanting);
    // funcFarmerNewPlanting();
}

function harvestNewRow() {
    console.log('harvestNewRow()');
    funcFarmerNewHarvest();
}

function viewPlantedRows() {
    console.log('viewPlantedRows()');
    funcFarmerViewRows();
}

function viewProduceOnHand() {
    console.log('viewProduceOnHand()');
    funcFarmerViewRows();
}
