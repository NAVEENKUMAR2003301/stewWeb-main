const exp = require("express")
const { contactFormSubmission } = require("../controllers/ContactController")

const router=exp.Router()

router.post("/form",contactFormSubmission)

module.exports=router