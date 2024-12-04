import Sequelize from "sequelize";
import connection from "../config/sequelizeConfig.js";
import Upload from "./Upload.js"; // Importa o modelo de Upload

const Diagnostico = connection.define("diagnosticos", {
    nivel_infeccao: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    recomendacoes: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    upload_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Upload,
            key: "id",
        },
    },
}, {
    timestamps: false,
});

Upload.hasMany(Diagnostico, { foreignKey: "upload_id" });
Diagnostico.belongsTo(Upload, { foreignKey: "upload_id" });

Diagnostico.sync({ force: false });
export default Diagnostico;
