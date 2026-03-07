import Contact from "../models/contact.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });
        res.status(201).json(contact);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}