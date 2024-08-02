const express = require('express');
const router = express.Router();
const Email = require('../models/email');

// Endpoint to schedule an email
router.post('/schedule-email', async (req, res) => {
  try {
    const email = new Email(req.body);
    await email.save();
    res.status(201).json(email);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to retrieve a list of scheduled emails
router.get('/scheduled-emails', async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to retrieve details of a specific scheduled email
router.get('/scheduled-emails/:id', async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.status(200).json(email);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to cancel a scheduled email
router.delete('/scheduled-emails/:id', async (req, res) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.status(200).json({ message: 'Email cancelled' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;