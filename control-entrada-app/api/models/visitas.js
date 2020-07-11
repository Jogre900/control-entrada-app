export default (sequelize, {UUID, UUIDV4, DATE, STRING}) => {
    const Visitas = sequelize.define('Visitas', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        id_ciudadano: {
            type: UUID,
            allowNull: false
        },
        id_destino: {
            type: UUID,
            allowNull: false
        },
        fecha_entrada: {
            type: DATE,
            allowNull: false
        },
        descipcion_entrada: {
            type: STRING,
            allowNull: true
        },
        fecha_salida: {
            type: DATE,
            allowNull: false
        },
        descipcion_salida: {
            type: STRING,
            allowNull: true
        },
        id_usuarioZona_entrada: {
            type: UUID,
            allowNull: false
        },
        id_usuarioZona_salida: {
            type: UUID,
            allowNull: false
        }
    })
    return Visitas 
}