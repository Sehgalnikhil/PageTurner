import mongoose from 'mongoose';

const auditLogSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    adminUsername: {
      type: String,
      default: 'Admin',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      enum: ['books', 'users', 'reviews', 'system', 'announcement'],
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

