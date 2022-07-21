const colors = require("../components/colors");

module.exports.getFileColor = (file) => {
    if(file.type == 'کلنگی' || file.type == 'مستغلات' || file.type == 'زمین') return colors.file3;
    else if(file.state == 'رهن و اجاره' || file.state == 'رهن کامل') return colors.file2;
    else  return colors.file1;
}
