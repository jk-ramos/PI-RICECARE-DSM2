import Sequelize from "sequelize"; // Apenas Sequelize
import connection from "../config/sequelizeConfig.js";

const Upload = connection.define("uploads", {
    nome_arquivo: {
        type: Sequelize.STRING, // Usando Sequelize diretamente
        allowNull: false
    },
    caminho: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_upload: {
        type: Sequelize.DATE,
        allowNull: false,// Corrigir a referência para Sequelize.NOW
    },
}, {
    timestamps: false,
});

Upload.sync({force:false});
export default Upload;
