import { openDB } from 'idb';

const DB_NAME = 'study-tracker-db';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Tasks store
    if (!db.objectStoreNames.contains('tasks')) {
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('subject', 'subject');
      taskStore.createIndex('status', 'status');
      taskStore.createIndex('dueDate', 'dueDate');
    }

    // Subjects store
    if (!db.objectStoreNames.contains('subjects')) {
      const subjectStore = db.createObjectStore('subjects', { keyPath: 'id' });
      subjectStore.createIndex('name', 'name');
    }

    // Stats store
    if (!db.objectStoreNames.contains('stats')) {
      const statsStore = db.createObjectStore('stats', { keyPath: 'date' });
    }

    // Sync queue store
    if (!db.objectStoreNames.contains('syncQueue')) {
      db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export const db = {
  // Tasks
  async getTasks() {
    const db = await dbPromise;
    return db.getAll('tasks');
  },

  async getTask(id) {
    const db = await dbPromise;
    return db.get('tasks', id);
  },

  async saveTask(task) {
    const db = await dbPromise;
    await db.put('tasks', task);
    await this.addToSyncQueue({ type: 'task', action: 'save', data: task });
  },

  async deleteTask(id) {
    const db = await dbPromise;
    await db.delete('tasks', id);
    await this.addToSyncQueue({ type: 'task', action: 'delete', id });
  },

  // Subjects
  async getSubjects() {
    const db = await dbPromise;
    return db.getAll('subjects');
  },

  async getSubject(id) {
    const db = await dbPromise;
    return db.get('subjects', id);
  },

  async saveSubject(subject) {
    const db = await dbPromise;
    await db.put('subjects', subject);
    await this.addToSyncQueue({ type: 'subject', action: 'save', data: subject });
  },

  async deleteSubject(id) {
    const db = await dbPromise;
    await db.delete('subjects', id);
    await this.addToSyncQueue({ type: 'subject', action: 'delete', id });
  },

  // Stats
  async getStats(date) {
    const db = await dbPromise;
    return db.get('stats', date);
  },

  async saveStats(stats) {
    const db = await dbPromise;
    await db.put('stats', stats);
    await this.addToSyncQueue({ type: 'stats', action: 'save', data: stats });
  },

  // Sync Queue
  async addToSyncQueue(item) {
    const db = await dbPromise;
    await db.add('syncQueue', {
      ...item,
      timestamp: new Date().toISOString(),
    });
  },

  async getSyncQueue() {
    const db = await dbPromise;
    return db.getAll('syncQueue');
  },

  async clearSyncQueue() {
    const db = await dbPromise;
    await db.clear('syncQueue');
  },

  // Sync with server
  async sync() {
    const queue = await this.getSyncQueue();
    const failedItems = [];

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'task':
            if (item.action === 'save') {
              await api.tasks.update(item.data.id, item.data);
            } else if (item.action === 'delete') {
              await api.tasks.delete(item.id);
            }
            break;

          case 'subject':
            if (item.action === 'save') {
              await api.subjects.update(item.data.id, item.data);
            } else if (item.action === 'delete') {
              await api.subjects.delete(item.id);
            }
            break;

          case 'stats':
            if (item.action === 'save') {
              await api.stats.updateStudyTime(item.data);
            }
            break;
        }
      } catch (error) {
        console.error('Sync failed for item:', item);
        failedItems.push(item);
      }
    }

    // Clear successfully synced items
    await this.clearSyncQueue();

    // Re-add failed items to the queue
    for (const item of failedItems) {
      await this.addToSyncQueue(item);
    }

    return failedItems.length === 0;
  },
};

// Sync periodically when online
if (navigator.onLine) {
  setInterval(() => {
    db.sync();
  }, 5 * 60 * 1000); // Sync every 5 minutes
}

// Sync when coming back online
window.addEventListener('online', () => {
  db.sync();
});
