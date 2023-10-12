// const Cache = require('file-system-cache').default
import { Cache } from 'file-system-cache';

const cache = new Cache({
  basePath: "./.cache", // (optional) Path where cache files are stored (default).
  ns: "grend-scrapper",   // (optional) A grouping namespace for items.
  hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
  ttl: 3600,
  // (optional) A time-to-live (in secs) on how long an item remains cached.
});


export default { cache }