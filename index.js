// Inicio necesario servidor

var express = require('express');
var app = express();

app.use(express.urlencoded({extended:"true"}));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
    res.render('pages/about');
});





// Fin necesario servidor

const ids = new Map(); // Map para guardar el tiempo en el que se actualizo/inicio un ID
const valor = new Map();

app.post('/accion', function(req, res){
    const id = parseInt(req.body.id);
    const accion = req.body.accion;
    const numero =  parseFloat(req.body.numero);
    checkIdsTime();
    ids.set(id, new Date());
    var valorLocal = 0;
    var nuevoId=false;
    var removed=false;
    if(typeof valor.get(id) !== "undefined"){
        valorLocal=valor.get(id).valor;
    }else{
        valorLocal=0;
        nuevoId=true;
    }
    switch(accion){
        case "+":
            valorLocal+=numero;
            break;
        case "-":
            valorLocal-=numero;
            break;
        case "*":
            valorLocal*=numero;
            break;
        case "/":
            valorLocal/=numero;
            break;
        case "r":
            valor.delete(id);
            ids.delete(id);
            removed=true;
            break;
    }
    if(!removed){
        if(nuevoId){
            valor.set(id,{
            "valor": valorLocal,
            "id":id,
            "operaciones": ("0 " + accion + " " + numero.toString())
        })
        }else{
            let operaciones = valor.get(id).operaciones;
            valor.set(id,{
                "valor": valorLocal,
                "id":id,
                "operaciones": (operaciones+ " " + accion + " " + numero.toString())
            });
        }
        console.log(valor.get(id));
        res.render('pages/accion', respuesta=valor.get(id));
    }

});


app.listen(4041);
console.log('4041 is the magic port');

function checkIdsTime(){
        ids.forEach((value, key, map) => {
            let startedAt = value.getHours()*3600 + value.getMinutes()*60 + value.getSeconds();
            let date = new Date();
            let now = date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds();
            console.log("id: " + key + " " + startedAt + " " + now); 
            if(now - startedAt >= 60){
                ids.delete(key);
                valor.delete(key);
            }

        });
}
