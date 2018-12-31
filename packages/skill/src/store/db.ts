import { credential, database, initializeApp } from 'firebase-admin';

const serviceAccount = require('../../../../serviceAccountKey.json');

try {
  initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: 'https://alice-debug.firebaseio.com',
  });
} catch (e) { /* ignore */}

export const db = database();
