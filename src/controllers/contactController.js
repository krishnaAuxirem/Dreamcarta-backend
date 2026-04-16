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
