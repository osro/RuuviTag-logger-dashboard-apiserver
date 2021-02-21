// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

// Server port
var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// Headers
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
    next();
});

/**
 * Returns battery data for given tag mac address
 */
app.get("/api/tag/:mac/battery", (req, res, next) => {
    console.log('battery status', req.originalUrl);
    var sql = "SELECT battery FROM sensors WHERE mac = ? ORDER BY timestamp DESC LIMIT 1"
    var params = [req.params.mac]
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(400).json({ "error": err.message });
            return;
        }

        console.log(">>> success", rows);
        res.json({
            "message": "success",
            "data": rows[0].battery
        })
    });
});


// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});