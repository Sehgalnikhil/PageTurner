import mongoose from 'mongoose';

const announcementSchema = mongoose.Schema(
  {
    text: {
      type: String,
      default: 'Welcome to PageTurner — A Digital Sanctuary for Book Lovers & Curators.',
    },
    subtext: {
      type: String,
      default: 'Explore classical philosophy, gothic fiction, and fine bindings.',
    },
    badge: {
      type: String,
      default: 'Curator Dispatch',
    },
    active: {
      type: Boolean,
      default: true,
    },
    tone: {
      type: String,
      enum: ['burgundy', 'amber', 'midnight'],
      default: 'burgundy',
    },
    link: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: 'Curator Admin',
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);

