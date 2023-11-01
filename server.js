const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended: true}));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

const range_min=70;
const range_max=120;
var current_glucose_level;
var HC_ratio;
var HC_to_consume;
let result = 0;

let error;

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/', (req, res) => {
    res.render('index');
});

//Route to calculator
app.route('/calculator')

    //Get method to render calculator.ejs
    .get((req, res) => {
        res.render(('calculator'), {result});
    })

    //Post method to render calculator.ejs with results of calculation, with error handling
    .post((req, res, next) => { 
        current_glucose_level = parseInt(req.body.current_glucose_level);
        HC_ratio = parseInt(req.body.HC_ratio);
        HC_to_consume = parseInt(req.body.HC_to_consume);

        if (!current_glucose_level && !HC_ratio && !HC_to_consume) {
            error = new Error("Missing values: You must fill all data required");
            error.status = 400;
            next(error);
        }
        else if ((current_glucose_level == 0 || HC_ratio == 0 || HC_to_consume == 0) || 
        (current_glucose_level == 0 && HC_ratio == 0 && HC_to_consume == 0)) {
            error = new Error("Values on 0: Data must be different from 0");
            error.status = 400;
            next(error);
        }
        else {
            if (current_glucose_level > range_max) {
                error = new Error("WARNING! Glucose levels exceding maximum range (" + range_max + ")");
                error.status = 601;
                next(error);
            }
            else if (current_glucose_level < range_min) {
                error = new Error("WARNING! Glucose levels exceding minimum range (" + range_min + ")");
                error.status = 602;
                next(error);
            }
            else {
                result = (HC_to_consume / HC_ratio).toFixed(2);
                res.redirect("/calculator");
            }
        }
        
    }, (error, req, res, next) => {
        console.error(error.stack);
        res.status(error.status || 500).render("error", {
        message: error.status + " = " + error.message, error: error.status
        });
    });

app.listen(1000, ()=>{ 

    console.log("App listening on port 100"); 

});
