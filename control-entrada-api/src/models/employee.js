export default (sequelize, { UUID, UUIDV4, STRING }) => {
  const Employee = sequelize.define("Employee", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: UUID,
      defaultValue: UUIDV4(),
    },
    dni: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    lastName: {
      type: STRING,
      allowNull: false,
    },
    picture: {
      type: STRING,
      allowNull: false,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
  });
  Employee.associate = models =>{
    Employee.hasMany(models.userZone, {
      ForeignKey: {
        name: 'employeeId',
        field: 'employee_id'
      },
      as: 'Horario',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    Employee.belongsTo(models.company)
  }
  return Employee;
};
