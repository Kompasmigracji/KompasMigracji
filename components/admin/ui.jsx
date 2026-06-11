"use strict";
"use client";
/* KompasCRM — Core UI Components Library */
import React, { useState, useEffect } from "react";

/* ---------- Icons (Minimal SVG set) ---------- */
const PATHS = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  compass: "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  cash: "M2 5h20v14H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus: "M12 5v14M5 12h14",
  back: "M19 12H5M12 19l-7-7 7-7",
  check: "M20 6 9 17l-5-5",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  restore: "M1 4v6h6M3.51 15a9 9 0 1 0 .49-4.46",
  alert:  "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  sun: "M12 17A5 5 0 1 0 12 7a5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  send: "M22 2 11 13M22 2 15 22 11 13 2 9z",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  copy: "M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up":   "M18 15l-6-6-6 6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
  zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  play: "M5 3l14 9-14 9V3z",
  pause: "M6 4h4v16H6zM14 4h4v16h-4z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  cpu: "M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3",
  truck: "M14 18H6a2 2 0 0 1-2 2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z M8 2v16 M16 6v16",
  navigation: "M3 11l19-9-9 19-2-8-8-2z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  card: "M2 4h20v16H2z M2 8h20 M6 14h4",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  archive: "M21 8v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8 M23 3H1v5h22z M10 12h4",
  award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
  "play-circle": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M10 8l6 4-6 4V8z",
  "book-open": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  x: "M18 6L6 18M6 6l12 12",
  menu: "M3 12h18M3 6h18M3 18h18",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  "message-square": "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3a1 1 0 0 1 1-1h15v20H5a1 1 0 0 1-1-1z",
  "check-circle": "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  "alert-circle": "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01",
  "alert-triangle": "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  "refresh-cw": "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  "more-horizontal": "M12 12h.01M19 12h.01M5 12h.01",
  "arrow-down-left": "M17 7 7 17M17 17H7V7",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "headphones": "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3",
  "phone-call": "M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  "mic-off": "M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8",
  "phone-off": "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07M23 1 1 23M1 12.58A2 2 0 0 1 2.68 10.6l3-1.72a2 2 0 0 1 2 .45l1.27 1.27",
  "upload-cloud": "M16 16.12a5 5 0 0 0 0-9.88M20 20.38a8 8 0 0 0-16 0 M12 12V3 M8 7l4-4 4 4",
  "download-cloud": "M16 16.12a5 5 0 0 0 0-9.88M20 20.38a8 8 0 0 0-16 0 M12 3v9 M8 8l4 4 4-4",
  "file-plus": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 18v-6 M9 15h6",
  "arrow-right": "M5 12h14M12 5l7 7-7 7",
  "more-vertical": "M12 12h.01M12 5h.01M12 19h.01",
  "paperclip": "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  "arrow-up": "M12 19V5M5 12l7-7 7 7",
  "edit-2": "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  "edit-3": "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  "toggle-right": "M16 5H8a7 7 0 0 0 0 14h8a7 7 0 0 0 0-14z M16 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "toggle-left": "M16 5H8a7 7 0 0 0 0 14h8a7 7 0 0 0 0-14z M8 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "code": "M16 18l6-6-6-6M8 6l-6 6 6 6",
  "layout": "M3 3h18v18H3zM3 9h18M9 21V9",
  "git-commit": "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M1.05 12h7.95 M15 12h7.95",
  "pie-chart": "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  "user-check": "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M16 11l2 2 4-4",
  "check-square": "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  "thermometer": "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
  "unlock": "M18 8A6 6 0 0 0 6 8v4M2 12h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z",
  "database": "M12 22c5.52 0 10-2.24 10-5V7c0-2.76-4.48-5-10-5S2 4.24 2 7v10c0 2.76 4.48 5 10 5z M2 7c0 2.76 4.48 5 10 5s10-2.24 10-5 M2 12c0 2.76 4.48 5 10 5s10-2.24 10-5",
  "message-circle": "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  "globe": "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  "smile": "M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01",
  "gift": "M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z",
  "star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "git-merge": "M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M6 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0 M21 18V8a4 4 0 0 0-4-4h-7M6 9v6",
  "bar-chart-2": "M18 20V10M12 20V4M6 20v-6",
  "trending-up": "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  "percent": "M19 5L5 19M6.5 6.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0 M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0"
};

export function Icon({ name, size = 18, color = "currentColor", fill = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? color : "none"} stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] || PATHS.grid} />
    </svg>
  );
}

/* ---------- StatCard / KPI ---------- */
export function StatCard({ icon, value, label, sub, trend = null }) {
  return (
    <div className="kc-stat">
      <div className="kc-stat-top">
        <div className="kc-stat-ico"><Icon name={icon} size={18} /></div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trend > 0 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <Icon name={trend > 0 ? 'chevron-up' : 'chevron-down'} size={14} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="kc-stat-val">{value}</div>
      <div className="kc-stat-lbl">{label}</div>
      {sub ? <div className="kc-stat-sub">{sub}</div> : null}
    </div>
  );
}

/* ---------- Badges ---------- */
const BADGE = {
  active: ["kc-badge-green", "Активний"],
  pending: ["kc-badge-brass", "Очікує"],
  suspended: ["kc-badge-red", "Заблокований"],
  new: ["kc-badge-blue", "Новий"],
  in_progress: ["kc-badge-brass", "В роботі"],
  converted: ["kc-badge-green", "Конверсія"],
  closed: ["kc-badge-dim", "Закрито"],
  open: ["kc-badge-blue", "Відкрито"],
  resolved: ["kc-badge-green", "Вирішено"],
  paid: ["kc-badge-green", "Оплачено"],
  unpaid: ["kc-badge-red", "Не оплачено"],
  exempt: ["kc-badge-dim", "Звільнений"],
  brass: ["kc-badge-brass", ""],
  blue: ["kc-badge-blue", ""],
  green: ["kc-badge-green", ""],
  red: ["kc-badge-red", ""],
  dim: ["kc-badge-dim", ""],
};

export function Badge({ status, text }) {
  const [cls, label] = BADGE[status] || ["kc-badge-dim", status];
  return <span className={`kc-badge ${cls}`}>{text || label}</span>;
}

/* ---------- Basic Elements ---------- */
export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-xl)" }}>
      <div className="kc-spin" />
    </div>
  );
}

export function EmptyState({ title = "Немає даних", description, icon = "inbox", action }) {
  return (
    <div className="kc-empty">
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--panel-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)' }}>
        <Icon name={icon} size={24} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 4px', color: 'var(--text)', fontSize: 'var(--text-md)', fontWeight: 600 }}>{title}</h3>
        {description && <p style={{ margin: 0, color: 'var(--dim)', fontSize: 'var(--text-sm)' }}>{description}</p>}
      </div>
      {action && <div style={{ marginTop: 'var(--space-sm)' }}>{action}</div>}
    </div>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name = "?", role = "", size = 32, src = null }) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <div className="kc-avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} /> : initials}
      </div>
      {(name !== "?" || role) && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {name !== "?" && <span className="kc-user-name">{name}</span>}
          {role && <span className="kc-user-role">{role}</span>}
        </div>
      )}
    </div>
  );
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ progress, max = 100, color = "var(--color-primary)", label }) {
  const pct = Math.min(100, Math.max(0, (progress / max) * 100));
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 'var(--text-xs)', color: 'var(--dim)' }}>
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{ height: 6, background: 'var(--panel-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}

/* ---------- SearchInput ---------- */
export function SearchInput({ value, onChange, placeholder = "Пошук...", style }) {
  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dim)', pointerEvents: 'none' }}>
        <Icon name="search" size={16} />
      </div>
      <input 
        className="kc-input" 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        style={{ paddingLeft: 36, paddingRight: value ? 36 : 12 }}
      />
      {value && (
        <button 
          onClick={() => onChange('')}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', padding: 4 }}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

/* ---------- DataTable ---------- */
export function DataTable({ columns, data, onRowClick, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!data || data.length === 0) return <EmptyState />;

  return (
    <div className="kc-table-wrap">
      <table className="kc-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={col.style}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} onClick={() => onRowClick && onRowClick(row)}>
              {columns.map((col, j) => (
                <td key={j} style={col.style}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- ConfirmDialog ---------- */
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Підтвердити", isDanger = false }) {
  if (!isOpen) return null;
  return (
    <div className="kc-modal-bg" onClick={onClose}>
      <div className="kc-modal" onClick={e => e.stopPropagation()}>
        <h2 className="kc-modal-title">{title}</h2>
        <p style={{ color: 'var(--dim)', marginBottom: 'var(--space-lg)' }}>{message}</p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button className="kc-btn kc-btn-ghost" onClick={onClose}>Скасувати</button>
          <button className={`kc-btn ${isDanger ? 'kc-btn-danger' : 'kc-btn-primary'}`} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sparkline (SVG) ---------- */
export function Sparkline({ data = [], w = 220, h = 56 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((v, i) => `${i * step},${h - (v / max) * (h - 8) - 4}`);
  const area = `0,${h} ${pts.join(" ")} ${w},${h}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polygon points={area} fill="var(--brass-bg)" />
      <polyline points={pts.join(" ")} fill="none" stroke="var(--color-primary)" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- BarList ---------- */
export function BarList({ items = [], unit = "" }) {
  if (!items.length) return <EmptyState />;
  const max = Math.max(...items.map((i) => Number(i.value) || 0), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 'var(--space-sm)' }}>
      {items.map((it) => (
        <div key={it.label}>
          <div className="kc-row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{it.label}</span>
            <span className="kc-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--dim)' }}>
              {it.value}{unit}
            </span>
          </div>
          <div style={{ height: 6, background: "var(--panel-2)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: '100%',
              width: ((Number(it.value) || 0) / max) * 100 + "%",
              background: it.color || "var(--color-primary)",
              borderRadius: 3,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
