import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';  // Importando fs para manipulação de arquivos
import Analise from '../models/Upload.js';

const router = express.Router();

// Configura o multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Caminho absoluto para o diretório 'public/uploads'
    const uploadPath = path.resolve('public/uploads');
    
    // Verifica se o diretório existe, caso contrário, cria
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Cria o diretório de forma recursiva
    }

    cb(null, uploadPath); // Define o caminho do diretório
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + '-' + file.originalname; // Combina o timestamp com o nome original
    cb(null, nomeArquivo);
},
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

// Rota para renderizar a página de upload
router.get('/upload', async (req, res) => {
  try {
    const uploads = await Analise.findAll();
    res.render('upload', { upload: uploads });
  } catch (error) {
    console.error('Erro ao buscar uploads:', error);
    res.render('upload', { upload: [], message: 'Erro ao carregar dados' });
  }
});

// Rota para processar o upload
// Rota para processar o upload
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    if (req.files.length > 0) {
      // Salvar o caminho das imagens no banco de dados
      const uploadedFiles = req.files.map(file => {
        return {
          nome_arquivo: file.originalname,
          caminho: '/uploads/' + file.filename, // Caminho relativo para a imagem
          data_upload: new Date(),
        };
      });

      // Aqui você deve inserir no banco de dados (exemplo com Analise)
      // Supondo que você tenha um modelo de "Upload" para salvar os dados
      await Analise.bulkCreate(uploadedFiles);

      res.render('upload', { message: `Upload de ${uploadedFiles.length} arquivos realizado com sucesso!` });
    } else {
      res.render('upload', { message: 'Nenhum arquivo enviado!' });
    }
  } catch (error) {
    console.error('Erro ao realizar upload:', error);
    res.render('upload', { message: 'Erro ao realizar upload. Tente novamente.' });
  }
});


export default router;
