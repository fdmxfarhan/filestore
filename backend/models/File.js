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
    meterage: {type: String, default: ''},
    bedroom: {type: String, default: ''},
    floor: {type: String, default: ''},
    numOfFloors: {type: String, default: ''}, // tabaghat
    unit: {type: String, default: ''}, // vahed
    buildAge: {type: String, default: ''},
    parking: {type: String, default: ''},
    warehouse: {type: String, default: ''}, // anbari
    elevator: {type: String, default: ''},
    kitchen: {type: String, default: ''},
    view: {type: String, default: ''}, // nama
    floortype: {type: String, default: ''}, // Kaf
    service: {type: String, default: ''}, 
    heatingAndCoolingSystem: {type: String, default: ''}, // systeme garmayesh va sarmayesh
    meterage2: {type: String, default: ''},
    bedroom2: {type: String, default: ''},
    floor2: {type: String, default: ''},
    numOfFloors2: {type: String, default: ''}, // tabaghat
    unit2: {type: String, default: ''}, // vahed
    buildAge2: {type: String, default: ''},
    parking2: {type: String, default: ''},
    warehouse2: {type: String, default: ''}, // anbari
    elevator2: {type: String, default: ''},
    kitchen2: {type: String, default: ''},
    view2: {type: String, default: ''}, // nama
    floortype2: {type: String, default: ''}, // Kaf
    service2: {type: String, default: ''}, 
    heatingAndCoolingSystem2: {type: String, default: ''}, // systeme garmayesh va sarmayesh
    meterage3: {type: String, default: ''},
    bedroom3: {type: String, default: ''},
    floor3: {type: String, default: ''},
    numOfFloors3: {type: String, default: ''}, // tabaghat
    unit3: {type: String, default: ''}, // vahed
    buildAge3: {type: String, default: ''},
    parking3: {type: String, default: ''},
    warehouse3: {type: String, default: ''}, // anbari
    elevator3: {type: String, default: ''},
    kitchen3: {type: String, default: ''},
    view3: {type: String, default: ''}, // nama
    floortype3: {type: String, default: ''}, // Kaf
    service3: {type: String, default: ''}, 
    heatingAndCoolingSystem3: {type: String, default: ''}, // systeme garmayesh va sarmayesh
    options: String, 
    price: Number, 
    fullPrice: Number, 
    lone: String,
    changable: String,
    discount: String,
    documentState: String,
    transfer: String,
    advertiser: String,
    fileID: String,
    images: {type:[Object], default: []},
    creationDate: {type: Date, default: new Date()},
});

var File = mongoose.model('File', FileSchema);

module.exports = File;
