// {
//     "email_id": "ObjectId",
//     "recipient": "String",
//     "subject": "String",
//     "body": "String",
//     "attachments": [
//       {
//         "filename": "String",
//         "path": "String"
//       }
//     ],
//     "schedule_time": "Date",
//     "is_recurring": "Boolean",
//     "recurrence": {
//       "type": "String", // "daily", "weekly", "monthly", "quarterly"
//       "details": {
//         "daily": ["Time"],
//         "weekly": {
//           "days": ["String"], // ["Monday", "Tuesday", ...]
//           "time": "Time"
//         },
//         "monthly": {
//           "day": "Number", // Day of the month (1-31)
//           "time": "Time"
//         },
//         "quarterly": {
//           "day": "Number", // Day of the quarter (1-90)
//           "time": "Time"
//         }
//       }
//     },
//     "status": "String", // "scheduled", "sent", "cancelled"
//     "created_at": "Date",
//     "updated_at": "Date"
//   }
  
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Attachment Schema
const AttachmentSchema = new Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true }
});

// Recurrence Details Schema
const RecurrenceDetailsSchema = new Schema({
  daily: [{ type: String }],
  weekly: {
    days: [{ type: String }],
    time: { type: String }
  },
  monthly: {
    day: { type: Number },
    time: { type: String }
  },
  quarterly: {
    day: { type: Number },
    time: { type: String }
  }
}, { _id: false });

// Recurrence Schema
const RecurrenceSchema = new Schema({
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly'], required: true },
  details: { type: RecurrenceDetailsSchema, required: true }
}, { _id: false });

// Email Schema
const EmailSchema = new Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  attachments: [AttachmentSchema],
  schedule_time: { type: Date, required: true },
  is_recurring: { type: Boolean, required: true },
  recurrence: RecurrenceSchema,
  status: { type: String, enum: ['scheduled', 'sent', 'cancelled'], default: 'scheduled' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pre-save hook to update the `updated_at` field
EmailSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;
