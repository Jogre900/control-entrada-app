const { Router } = require("express");
const router = Router()

router.get('/hello', (req, res) => {
    res.status(200).send(`<h3>Hello World</h3>`)
})


module.exports = router
