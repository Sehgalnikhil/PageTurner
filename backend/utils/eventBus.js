import { EventEmitter } from 'events';

// Application Event Bus using Node.js EventEmitter
class AuditEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.recentEvents = [];
    this.maxEvents = 50;
  }

  logEvent(type, payload) {
    const eventRecord = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.recentEvents.unshift(eventRecord);
    if (this.recentEvents.length > this.maxEvents) {
      this.recentEvents.pop();
    }

    // Emit the custom event
    this.emit(type, eventRecord);
  }

  getRecentEvents() {
    return this.recentEvents;
  }
}

export const auditEmitter = new AuditEventEmitter();

// Register listeners for audit trail
auditEmitter.on('book:created', (evt) => {
  console.log(`[EventEmitter Audit] Book Created: ${evt.payload?.title || 'Unknown'}`);
});

auditEmitter.on('book:updated', (evt) => {
  console.log(`[EventEmitter Audit] Book Updated ID: ${evt.payload?.id || 'Unknown'}`);
});

auditEmitter.on('book:deleted', (evt) => {
  console.log(`[EventEmitter Audit] Book Deleted ID: ${evt.payload?.id || 'Unknown'}`);
});

auditEmitter.on('user:registered', (evt) => {
  console.log(`[EventEmitter Audit] New User Registered: ${evt.payload?.username || 'Unknown'}`);
});

auditEmitter.on('user:login', (evt) => {
  console.log(`[EventEmitter Audit] User Login: ${evt.payload?.username || 'Unknown'}`);
});
