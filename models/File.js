var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
    area: String,
    ownerName: String,
    constPhone: String,
    phone: String,
    address: String,
    type: String,
    date: Date,
    dateJ: Object,
    state: String,
    fileNumber: Number,
    role: String,
    meterage: String,
    bedroom: String,
    floor: String,
    numOfFloors: String, // tabaghat
    unit: String, // vahed
    buildAge: String,
    parking: String,
    warehouse: String, // anbari
    elevator: String,
    kitchen: String,
    view: String, // nama
    floortype: String, // Kaf
    service: String, 
    heatingAndCoolingSystem: String, // systeme garmayesh va sarmayesh
    options: String, 
    price: String, 
    fullPrice: String, 
    lone: String,
    changable: String,
    discount: String,
    documentState: String,
    transfer: String,
    advertiser: String,
});

var File = mongoose.model('File', FileSchema);

module.exports = File;
