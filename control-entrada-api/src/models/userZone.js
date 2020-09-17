export default ( sequelize, {UUID, UUIDV4, DATE}) => {
    const UserZone = sequelize.define('UserZone', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4()
        },
        assignationDate: {
            type: DATE,
            allowNull: false,
        },
        changeTurnDate: {
            type: DATE,
            allowNull: false
        }
    })
    UserZone.associate = models => {
        UserZone.belongsTo(models.employee)
        UserZone.belongsTo(models.zone)
        UserZone.belongsTo(models.User)
    }
    return UserZone
}