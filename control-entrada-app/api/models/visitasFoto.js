export default (sequelize, {UUID, UUIDV4, STRING} ) => {
    const VisitaFoto = sequelize.define('VisitaFoto', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        id_visitas: {
            type: UUID,
            allowNull: false
        },
        foto: {
            type: STRING,
            allowNull: false
        },
        entrada: {
            type: STRING,
            allowNull: false
        }
    })
    return VisitaFoto
}