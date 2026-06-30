require('@testing-library/jest-dom');
// Minimal polyfills for jsdom environment
global.Request = class Request {};
global.Response = class Response {};
global.Headers = class Headers {};
global.fetch = () => Promise.resolve({ json: async () => ({}) });
