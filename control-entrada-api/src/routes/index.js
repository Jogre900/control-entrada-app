import { Router } from "express"
import Methods from "@methods"

const router = Router()

    router.get("/test", Methods.test)
    router.post("/createUser", Methods.createUser)
    router.get("/findUsers", Methods.findUsers)
module.exports = router