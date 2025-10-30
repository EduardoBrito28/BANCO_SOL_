import os from 'os';

export function getLocalIp(): string {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
        const family = String(net.family);
        const isIPv4 = family === 'IPv4' || family === '4';
        const isLocal = !net.internal;

        if (isIPv4 && isLocal) {
          return net.address;
        }
      }
  }

  return '127.0.0.1'; // fallback
}
