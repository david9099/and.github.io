import PocketBase from 'pocketbase';

// Initialize PocketBase with the environment variable
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);