export default (sequelize, { UUID, UUIDV4, DATE }) => {
    const usuarioZona = sequelize.define('usuarioZona', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        id_usuario: {
            type: UUID,
            allowNull: false
        },
        id_zona: {
            type: UUID,
            allowNull: false
        },
        fecha_asignacion: {
            type: DATE,
            allowNull: false
        },
        fecha_cambio: {
            type: DATE,
            allowNull: false
        }
    })
    return usuarioZona
}