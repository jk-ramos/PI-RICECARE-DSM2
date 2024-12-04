import express from 'express';
const router = express.Router();
import Diagnostico from "../models/Diagnostico.js";
import Upload from "../models/Upload.js";

router.get('/diagnostico', async (req, res) => {
    try {
        console.log('Buscando diagnósticos...');
        const diagnosticos = await Diagnostico.findAll({
            include: {
                model: Upload,
                attributes: ["nome_arquivo", "caminho", "data_upload"],
            },
        });

        console.log("Diagnósticos encontrados:", diagnosticos);

        diagnosticos.forEach(diagnostico => {
            console.log("Processando diagnóstico:", diagnostico);
            if (diagnostico.upload && diagnostico.upload.caminho) {
                // Verifica se o caminho contém informações antigas ou inválidas
                if (!diagnostico.upload.caminho.includes('uploads/')) {
                    // Atualize ou corrija o caminho aqui, caso necessário
                    diagnostico.upload.caminho = '/uploads/' + diagnostico.upload.caminho.split('/').pop();
                }
            }
        });

        console.log('Diagnósticos atualizados com caminhos corrigidos:', diagnosticos);
        res.render('diagnostico', { diagnosticos });
    } catch (error) {
        console.error('Erro ao buscar diagnósticos:', error);
        res.render('diagnostico', { diagnosticos: [], message: 'Erro ao carregar diagnósticos' });
    }
});




// Lista de diagnósticos
export const getDiagnosticos = async (req, res) => {
    try {
        const diagnósticos = await Diagnostico.findAll({
            include: {
                model: Upload, // Relacionamento com uploads
                attributes: ["nome_arquivo", "data_upload"],
            },
        });

        res.render("diagnostico", { diagnósticos }); // Renderiza a view 'diagnostico.ejs'
    } catch (error) {
        console.error("Erro ao buscar diagnósticos:", error);
        res.status(500).send("Erro ao buscar diagnósticos");
    }
};

// Criação de um novo diagnóstico
export const createDiagnostico = async (req, res) => {
    try {
        const { upload_id, nivel_infeccao, recomendacoes } = req.body;

        await Diagnostico.create({ upload_id, nivel_infeccao, recomendacoes });
        res.redirect("/diagnostico");
    } catch (error) {
        console.error("Erro ao criar diagnóstico:", error);
        res.status(500).send("Erro ao criar diagnóstico");
    }
};

// Deletar um diagnóstico
export const deleteDiagnostico = async (req, res) => {
    try {
        const { id } = req.params;

        await Diagnostico.destroy({ where: { id } });
        res.redirect("/diagnostico");
    } catch (error) {
        console.error("Erro ao deletar diagnóstico:", error);
        res.status(500).send("Erro ao deletar diagnóstico");
    }
};


export default router;
