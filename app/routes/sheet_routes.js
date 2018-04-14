const fs = require('fs');
const mongoose = require('mongoose');

let Sheet = mongoose.model('Sheet');

module.exports = function (app) {
    // Upload a sheet, save it to the database, redirect to its view
    app.post('/sheet/upload', (req, res) => {
        if (req.files) {
            let uploadedSheetFile = req.files.sheetfile;
            let sheetTitle = req.body.sheettitle;
            let sheetQuestions = [];
            
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1;
            let yyyy = today.getFullYear();

            if(dd < 10) { dd = '0' + dd } 
            if(mm < 10) { mm = '0'+mm } 
            today = mm + '/' + dd + '/' + yyyy;
            
            let newSheet = new Sheet({
                file_name: sheetTitle,
                questions: sheetQuestions,
                date: today
            });

            let sheetBuffer = uploadedSheetFile.data;

            fs.writeFile('public/sheet-files/' + sheetTitle + '.csv', sheetBuffer, (err) => {
                if (err) { res.send(err); }

                newSheet.save((err, sheet) => {
                    if (err) {
                        res.send(err);
                    }

                    Sheet.findOne({ file_name: sheetTitle }, (err, sheet) => {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.redirect('/sheet?sheetID=' + sheet.id);
                        }
                    });
                });
            });
        }
    });
}