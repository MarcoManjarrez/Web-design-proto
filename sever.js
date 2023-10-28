const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(express.static("public"));

app.use(bodyparser.urlencoded({extended: true}));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render("index");
});



app.listen(1000, ()=>{ 

    console.log("App listening on port 100"); 

});