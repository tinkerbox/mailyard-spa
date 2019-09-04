/* globals importScripts, workbox */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const APP_NAME = 'mailyard';
const WORKER_VER = 'v1';

workbox.routing.registerRoute(
  /.*amazonaws.com/,
  new workbox.strategies.CacheFirst({
    cacheName: `${APP_NAME}-${WORKER_VER}-s3`,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 320,
        maxAgeSeconds: 30 * 24 * 60 * 60, // cache for 30 days
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
    ],
    matchOptions: {
      ignoreSearch: true,
    },
  }),
);
