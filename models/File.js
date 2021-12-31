var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
    area: String,
    ownerName: String,
    constPhone: String,
    phone: String,
    address: String,
    type: String,
    date: String,
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
    meterage2: String,
    bedroom2: String,
    floor2: String,
    numOfFloors2: String, // tabaghat
    unit2: String, // vahed
    buildAge2: String,
    parking2: String,
    warehouse2: String, // anbari
    elevator2: String,
    kitchen2: String,
    view2: String, // nama
    floortype2: String, // Kaf
    service2: String, 
    heatingAndCoolingSystem2: String, // systeme garmayesh va sarmayesh
    meterage3: String,
    bedroom3: String,
    floor3: String,
    numOfFloors3: String, // tabaghat
    unit3: String, // vahed
    buildAge3: String,
    parking3: String,
    warehouse3: String, // anbari
    elevator3: String,
    kitchen3: String,
    view3: String, // nama
    floortype3: String, // Kaf
    service3: String, 
    heatingAndCoolingSystem3: String, // systeme garmayesh va sarmayesh
    options: String, 
    price: Number, 
    fullPrice: Number, 
    lone: String,
    changable: String,
    discount: String,
    documentState: String,
    transfer: String,
    advertiser: String,
});

var File = mongoose.model('File', FileSchema);

module.exports = File;
