import express from 'express';
import connection from './config/sequelizeConfig.js';
import session from 'express-session';
import flash from 'express-flash';
import multer from 'multer';
import path from 'path';

const app = express();

// Configurando o Express para receber dados vindo do formulário
app.use(express.urlencoded({ extended: false }));

// Define o EJS como renderizador de páginas
app.set('view engine', 'ejs');

// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'));

// Configuração do middleware de autenticação e flash messages
app.use(session({
    secret: "weedsecret",
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false
}));

// Configurando o multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Pasta onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo com timestamp
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos JPEG e PNG são permitidos.'));
        }
    }
});

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

// ROTA DE LOGIN
app.get('/login', (req, res) => {
    res.render('login');
});

// ROTA DE UPLOAD
app.get('/', (req, res) => {
    res.render('upload', { message: null }); // Renderiza a página inicial com o formulário de upload
});

app.post('/upload', upload.array('images', 10), (req, res) => {
    try {
        if (req.files.length > 0) {
            const uploadedFiles = req.files.map(file => file.filename); // Nome dos arquivos enviados
            res.render('upload', { message: `Upload de ${uploadedFiles.length} arquivos realizado com sucesso!` });
        } else {
            res.render('upload', { message: 'Nenhum arquivo enviado!' });
        }
    } catch (error) {
        console.error(error);
        res.render('upload', { message: 'Erro ao realizar upload. Tente novamente.' });
    }
});

// Iniciando o servidor
app.listen(8080, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
