import Contact from '../models/Contact.js';

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'name, email, subject, message are required ❌',
      });
    }

    await Contact.create({
      name,
      email,
      subject,
      message,
    });

    return res.status(201).json({ message: 'Message received ✅' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit contact form ❌' });
  }
};

export const getContacts = async (_req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load contact messages ❌' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found ❌' });
    }

    await contact.destroy();
    return res.status(200).json({ message: 'Contact message deleted ✅' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete contact message ❌' });
  }
};
