

const contactFormSubmission =
    (req, res) => {
        const { name, phone, email, eventType, eventDate, city } = req.body;
        try {

        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }


module.exports = { contactFormSubmission }