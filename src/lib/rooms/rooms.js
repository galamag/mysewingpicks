/*
  The room models by page key, and the catalogue category each room belongs to
  (its products and sections are checked against that category, see check.js).
  A new room: its model in src/lib/rooms/<key>.js, registered here.
  projects has no category: its items are projects, not products.
*/
import setup from './setup.js';
import tools from './tools.js';

export const ROOMS = { setup, tools };

export const ROOM_CATEGORY = { setup: 'setup', tools: 'tools', fabrics: 'fabrics', projects: null };
