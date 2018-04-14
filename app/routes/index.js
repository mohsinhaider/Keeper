const sheetRoutes = require('./sheet_routes');

module.exports = function(app) {
    sheetRoutes(app);
}