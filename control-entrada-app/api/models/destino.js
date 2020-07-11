export default (sequelize, { UUID, UUIDV4, STRING }) => {
    const Destino = sequelize.define('Destino', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        id_zona : {
            type: UUID,
            allowNull: false
        },
        destino: {
            type: STRING,
            allowNull: false
        }
    })
    return Destino
}