import { Router } from "express"
import Methods from "@methods"

const router = Router()

    router.get("/test", Methods.test)

module.exports = router