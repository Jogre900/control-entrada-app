export default (sequelize, { UUID, UUIDV4, STRING }) => {
    const Ciudadano = sequelize.define('Ciudadano', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        nombres: {
            type: STRING,
            allowNull: false
        },
        apellidos: {
            type: STRING,
            allowNull: false
        },
        dni: {
            type: STRING,
            allowNull: false
        },
        foto: {
            type: STRING,
            allowNull: false
        }
    })
    return Ciudadano
}