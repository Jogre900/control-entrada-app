import models from "@models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op, fn, col, literal } from "sequelize";
import moment from "moment";
import { Expo } from "expo-server-sdk";
import fetch from "node-fetch";
import { $security, $serverPort } from "@config";
import notification from "./notification";

const SECRETKEY = process.env.SECRETKEY || $security().secretKey;

const visits = {
  //CREATE VISIT
  createVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    //console.log("headers---",req.headers)
    // console.log("BODY--", req.body);
    // console.log("fotos----", req.file);
    const {
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinyId,
      citizenId
    } = req.body;
    let visitInput = {
      entryDate,
      departureDate,
      UserZoneId: userZoneId,
      destinationId: destinyId,
      citizenId
    };
    if (descriptionEntry) visitInput.descriptionEntry = descriptionEntry;
    try {
      const visit = await models.Visits.create(
        {
          ...visitInput,
          Fotos: {
            picture: req.file.filename,
            entry: "algo"
          }
        },
        {
          include: {
            model: models.Picture,
            as: "Fotos"
          }
        }
      );
      if (visit) {
        //INCREMENT USERCOMPANY
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues.companyId);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        //console.log(userCompanyU)

        //INCREMENT ZONE
        const zone = await models.Zone.findOne({
          include: {
            model: models.UserZone,
            as: "encargado_zona",
            where: {
              id: userZoneId
            }
          }
        });
        //console.log("ZONE DATAVA---",zone.dataValues);

        await zone.increment("visits");
        await zone.reload();
        await zone.save();
        //INCREMENT DESTINY
        //console.log("DESTINY ID---", destinyId);
        const destinyU = await models.Destination.findOne({
          where: { id: destinyId }
        });
        //console.log("DESTINY FIND IT--", destinyU.dataValues);
        await destinyU.increment("visits");
        await destinyU.reload();
        await destinyU.save();

        //BUSCAR ADMIN Y SUPERVISOR ZONA
        const admin = await models.UserCompany.findOne({
          where: {
            [Op.and]: [
              { privilege: "Admin" },
              { companyId: userCompany.dataValues.companyId }
            ]
          }
        });
        console.log("ADMIN-", admin.dataValues);
        const adminId = admin.dataValues.userId;

        //CREAR NOTI
        const newNoti = await notification.createNotification(
          adminId,
          "Segunda Prueba",
          "Visit",
          userId,
          visit.id
        );

        console.log("NOTIFICATION--", newNoti.dataValues);
        // const superV = await models.User.findAll({
        //   include: [
        //     {model: models.Employee, as: 'Employee'},
        //     {model: models.UserZone, as: 'userZone', include: {
        //       model: models.Zone, as: 'Zona', include: {
        //         model: models.Destination, as: 'Destino', where: {
        //           id: destinyId
        //         }
        //       }
        //     }},
        //     {model: models.UserCompany, as: 'UserCompany', where: {
        //       privilege: 'Supervisor'
        //     }}
        //   ]
        // })

        RESPONSE.error = false;
        RESPONSE.data = visit;
        RESPONSE.msg = "Registro exitoso!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },

  //CREATE NEW CITIZEN AND VISIT
  createCitizen: async function(req, res) {
    let RESPONSE = {
      error: true,
      data: null,
      msg: null,
      token: null
    };
    const {
      name,
      lastName,
      dni,
      entryDate,
      descriptionEntry,
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinyId
    } = req.body;
    console.log("req.body create citizen--", req.body);
    console.log(req.headers);
    try {
      let person = await models.Citizen.findOne({
        where: {
          dni
        }
      });
      if (person) {
        let visit = await models.Visits.create(
          {
            entryDate,
            descriptionEntry,
            departureDate,
            descriptionDeparture,
            destinationId: destinyId,
            UserZoneId: userZoneId,
            citizenId: person.id,
            Fotos: {
              picture: req.files[0].filename,
              entry: "algo"
            }
          },
          {
            include: {
              model: models.Picture,
              as: "Fotos"
            }
          }
        );
        //console.log("visita con dni ya registrado", visit)
        RESPONSE.msg = "Usuario ya registrado";
        RESPONSE.data = person;
        res.status(200).json(RESPONSE);
      } else {
        let visits = await models.Citizen.create(
          {
            dni,
            name,
            lastName,
            picture: req.files[0].filename,
            Visitas: {
              entryDate,
              descriptionEntry,
              departureDate,
              destinationId: destinyId,
              UserZoneId: userZoneId,
              Fotos: {
                picture: req.files[1].filename,
                entry: "algo"
              }
            }
          },
          {
            include: [
              {
                model: models.Visits,
                as: "Visitas",
                include: { model: models.Picture, as: "Fotos" }
              }
            ]
          }
        );
        //INCREMENT USERCOMPANY
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        //console.log(userCompanyU)

        //INCREMENT ZONE
        const zone = await models.Zone.findOne({
          include: {
            model: models.UserZone,
            as: "encargado_zona",
            where: {
              id: userZoneId
            }
          }
        });
        //console.log("ZONE DATAVA---",zone.dataValues);

        await zone.increment("visits");
        await zone.reload();
        await zone.save();
        //INCREMENT DESTINY
        console.log("DESTINY ID---", destinyId);
        const destinyU = await models.Destination.findOne({
          where: { id: destinyId }
        });
        console.log("DESTINY FIND IT--", destinyU.dataValues);
        await destinyU.increment("visits");
        await destinyU.reload();
        await destinyU.save();

        RESPONSE.error = false;
        RESPONSE.msg = "Registro Exitoso";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      console.log(error.message);
      res.json(RESPONSE);
    }
  },

  findCitizen: async function(req, res) {
    let RESPONSE = {
      error: true,
      data: null,
      msg: null,
      token: null
    };
    const { dni } = req.params;
    // try {
    //   const citizen = await models.Citizen.findOne({
    //     where: {
    //       dni
    //     }
    //   });
    //   if (citizen) {
    //     (RESPONSE.error = false),
    //       (RESPONSE.data = citizen),
    //       (RESPONSE.msg = "Busqueda exitosa!");
    //     res.json(RESPONSE);
    //   } else {
    //     RESPONSE.msg = "dni no registrado";
    //     res.json(RESPONSE);
    //   }
    // } catch (error) {
    //   RESPONSE.msg = error.message;
    //   res.json(RESPONSE);
    // }
  },
  //FIND MAX VISITS REGISTER USER
  findMaxVisitUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { companyId } = req.params;
    try {
      const maxVisits = await models.UserCompany.findOne({
        where: {
          companyId,
          privilege: "Watchman"
        },
        attributes: [[fn("max", col("visits")), "visits"]],
        //group: ['id'],
        raw: true
      });
      const userCompany = await models.UserCompany.findAll({
        where: {
          companyId
        },
        raw: true
      });
      //ENCONTRAR EL VALOR MAS ALTO EN UN ARRAY DE OBJETOS
      // const prueba = Math.max.apply(Math, userCompany.map(function(o) { return o.visits; }))
      //DEVUELVE EL OBJETO CON LA PROPIEDAD MAS ALTA
      // const prueba = userCompany.reduce((prev, current) => (prev.visits > current.visits) ? prev : current)
      // console.log(prueba)

      const max = userCompany.filter(
        ({ visits }) => visits === maxVisits.visits
      );
      console.log(max);
      const userWithMax = await models.User.findOne({
        where: {
          id: max[0].userId
        },
        include: [
          { model: models.Employee, as: "Employee" },
          { model: models.UserCompany, as: "UserCompany" },
          { model: models.UserZone, as: "userZone" }
        ]
      });
      if (userCompany) {
        RESPONSE.error = false;
        (RESPONSE.data = userWithMax), (RESPONSE.msg = "Busqueda exitosa!");
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //DELETE Visits
  deleteVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      token: null
    };
    const { id } = req.body;
    console.log("DELETE VISIT----", id);
    try {
      let visit = await models.Visits.destroy({
        where: {
          id
        }
      });
      if (visit) {
        RESPONSE.error = false;
        RESPONSE.data = visit;
        RESPONSE.msg = "Registro borrado con exito!";
        res.status(200).json(RESPONSE);
        console.log(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //CREATE DEPARTURE
  createDeparture: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const {
      departureDate,
      descriptionDeparture,
      userZoneId,
      destinationId
    } = req.body;
    const { id } = req.params;

    let inputs = {};
    inputs.visitId = id;
    inputs.departureDate = departureDate;
    inputs.UserZoneId = userZoneId;
    inputs.destinationId = destinationId;
    if (descriptionDeparture) {
      inputs.descriptionDeparture = descriptionDeparture;
    }

    let increment = false;
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        },
        include: {
          model: models.UserZone
        },
        raw: true
      });
      console.log(visit.UserZoneId, userZoneId);
      if (visit.UserZoneId !== userZoneId) {
        increment = true;
      }
      let departure = await models.Departure.create({ ...inputs });

      if (increment) {
        console.log("hay que incrementar");
        const user = await models.User.findOne({
          include: {
            model: models.UserZone,
            as: "userZone",
            where: {
              id: userZoneId
            }
          }
        });
        const userId = user.dataValues.id;
        console.log("userId----", userId);
        const userCompany = await models.UserCompany.findOne({
          where: {
            userId
          }
        });
        console.log(userCompany.dataValues);
        await userCompany.increment("visits");
        await userCompany.reload();
        await userCompany.save();
        console.log(userCompany.dataValues);
      }
      if (departure) {
        const visitU = await models.Visits.findOne({
          where: {
            id
          },

          include: [
            {
              model: models.Departure,
              as: "Salida",
              include: {
                model: models.UserZone,
                include: {
                  model: models.User,
                  as: "User",
                  include: {
                    model: models.Employee,
                    as: "Employee"
                  }
                }
              }
            },
            { model: models.Citizen, as: "Visitante" },
            { model: models.Destination, as: "Destino" },
            { model: models.Picture, as: "Fotos" },
            {
              model: models.UserZone,
              as: "UserZone",
              include: [
                { model: models.Zone, as: "Zona" },
                {
                  model: models.User,
                  as: "User",
                  include: {
                    model: models.Employee,
                    as: "Employee"
                  }
                }
              ]
            }
          ]
        });
        RESPONSE.error = false;
        RESPONSE.msg = "Actualizacion Existosa";
        RESPONSE.data = visitU;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },

  //FIND VISIT BY ID
  findVisitId: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { id } = req.params;
    try {
      let visit = await models.Visits.findOne({
        where: {
          id
        },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visit) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visit;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //FIND BY DNI
  findVisit: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    const { dni } = req.params;
    console.log(dni);

    try {
      let visit = await models.Visits.findAll({
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante", where: { dni } },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      console.log(visit);
      if (visit.length > 0) {
        RESPONSE.error = false;
        RESPONSE.msg = "Consulta Exitosa";
        RESPONSE.data = visit;

        res.json(RESPONSE);
      } else {
        RESPONSE.msg = "Dni no registrado";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  //FIND TODAY VISITS FROM ALL EMPLOYEE
  findTodayVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    const { id } = req.body;
    try {
      let visits = await models.Visits.findAll({
        //where: {
        //   entryDate: {
        //     [Op.between]: [
        //       `${moment().format("YYYY-MM-DD")} 00:00:00`,
        //       `${moment().format("YYYY-MM-DD")} 23:59:00`
        //     ]
        // }
        //},
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"]
          },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              },
              {
                model: models.Zone,
                as: "Zona",
                where: {
                  id
                }
                // include: {
                //   model: models.Company,
                //   as: "companyZone",
                //   where: {
                //     id: companyId
                //   }
                // }
              }
            ]
          }
        ]
      });

      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findTodayVisitsByUser: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    const { userzoneId } = req.params;
    try {
      let visits = await models.Visits.findAll({
        where: {
          UserZoneId: userzoneId
          // entryDate: {
          //   [Op.between]: [
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 00:00:00`,
          //     `${moment().format("YYYY MM D, HH:mm:ss")} 23:59:00`
          //   ]
          // }
        },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            as: "UserZone",
            include: [
              { model: models.Zone, as: "Zona" },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visits) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      } else {
        RESPONSE.error = false;
        RESPONSE.msg = "No hay Resultados!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findTodayVisitsByDestiny: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };
    console.log("ENTRO--", req.params);
    const { destinyId, checked } = req.params;
    let array = [];
    if (destinyId.length) {
      array = destinyId.split(",");
    }

    try {
      let visits = await models.Visits.findAll({
        where: {
          destinationId: array.length ? array : destinyId
          // createdAt: {
          //   [Op.and]: {
          //     [Op.gt]: moment().format("YYYY-MM-DD 00:00"),
          //     [Op.lte]: moment().format("YYYY-MM-DD 23:59")
          //   }
          // }
          //createdAt : { [Op.gt] : moment().format('YYYY-MM-DD 00:00')},
          //createdAt : { [Op.lte] : moment().format('YYYY-MM-DD 23:59')}
        },
        //where: {

        //UserZoneId: id

        //},
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Destination, as: "Destino" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              {
                model: models.Zone,
                as: "Zona",
                attributes: ["id", "zone"]
              },
              {
                model: models.User,
                attributes: ["email"],
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            ]
          }
        ]
      });
      if (visits) {
        RESPONSE.error = false;
        RESPONSE.msg = "Busqueda Exitosa!";
        RESPONSE.data = visits;
        res.json(RESPONSE);
      } else {
        RESPONSE.error = false;
        RESPONSE.msg = "No hay Resultados!";
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  },
  findWeekVisits: async function(req, res) {
    let RESPONSE = {
      error: true,
      msg: "",
      data: null,
      tokn: null
    };

    try {
      const visits = await models.Visits.findAll({
        // where: {
        //   entryDate: {
        //     [Op.between]: [
        //       moment()
        //         .subtract(7, "days")
        //         .calendar(),
        //       `${moment().format("YYYY-MM-DD")} 23:59:00`
        //     ]
        //   }
        // },
        include: [
          {
            model: models.Departure,
            as: "Salida",
            include: {
              model: models.UserZone,
              include: {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee"
                }
              }
            }
          },
          { model: models.Citizen, as: "Visitante" },
          { model: models.Picture, as: "Fotos" },
          {
            model: models.Destination,
            as: "Destino",
            attributes: ["id", "name"]
          },
          {
            model: models.UserZone,
            attributes: ["id", "changeTurnDate", "assignationDate"],
            include: [
              { model: models.Zone, as: "Zona", attributes: ["id", "zone"] },
              {
                model: models.User,
                as: "User",
                include: {
                  model: models.Employee,
                  as: "Employee",
                  attributes: ["id", "name", "lastName", "dni", "picture"]
                }
              }
            ]
          }
        ]
      });

      if (visits) {
        (RESPONSE.error = false), (RESPONSE.msg = "Busqueda exitosa!");
        RESPONSE.data = visits;
        res.json(RESPONSE);
      }
    } catch (error) {
      RESPONSE.msg = error.message;
      res.json(RESPONSE);
    }
  }
};

export default visits;
