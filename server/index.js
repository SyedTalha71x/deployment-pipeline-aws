import { networkInterfaces } from 'os';
import app from './app';

const PORT = process.env.PORT || 4008;

app.listen(PORT, '0.0.0.0', () => {
    // function getServerIp() {
    //     const networkInterf = networkInterfaces();
    //     for (const interfaceName in networkInterf) {
    //         const interf = networkInterf[interfaceName];
    //         for (const alias of interf) {
    //             if (alias.family === 'IPv4' && !alias.internal) {
    //                 return alias.address;
    //             }
    //         }
    //     }
    //     return 'Unknown IP';
    // }

    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // console.log(`CORS enabled - JWT Bearer tokens only`);
    // console.log(`Authentication: JWT only - No sessions/cookies`);
});
