import express from 'express';
import connection from './config/sequelizeConfig.js';
import session from 'express-session';
import flash from 'express-flash';
const app = express();


// Configuração do middleware de autenticação e flash messages
app.use(session({
    secret: "weedsecret",
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false
}));

import UsersController from "./controllers/UsersController.js"
import UploadController from "./controllers/UploadController.js";
import DiagnosticoController from "./controllers/DiagnosticoController.js";


// Definindo o uso das rotas dos Controllers
app.use("/", UsersController)
app.use("/", UploadController);
app.use("/", DiagnosticoController);

// Realizando a conexão com o banco de dados
connection.authenticate().then(() => {
    console.log("Conexão com o banco de dados feita com sucesso!");
}).catch((error) => {
    console.log(error);
});

// Criando o banco de dados se ele não existir
connection.query(`CREATE DATABASE IF NOT EXISTS AAA;`).then(() => {
    console.log("O banco de dados está criado.");
}).catch((error) => {
    console.log(error);
});

app.use(flash())


app.use(express.urlencoded({extended: false}))

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get("/", (req,res) => {
        res.render("index", {
            messages: req.flash()
        })
    })

// Iniciando o servidor
app.listen(8080, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
