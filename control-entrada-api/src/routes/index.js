import { Router } from "express"
import Methods from "@methods"

const router = Router()

    router.get("/test", Methods.test)
    router.post("/createUser", Methods.createUser)
    router.get("/findUsers", Methods.findUsers)
    router.post("/createCompany", Methods.createCompany)
    router.post("/createZone/:id", Methods.createZone)
    router.get("/findZones", Methods.findZones)
    router.post("/createDestiny/:id", Methods.createDestiny)
    router.get("/findDestiny/:id", Methods.findDestinyByZone)
    router.post("/createEmployee", Methods.createEmployee)
    router.get("/findEmployees", Methods.findEmployees)
module.exports = router