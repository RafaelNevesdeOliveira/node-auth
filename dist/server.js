import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';
const port = process.env.PORT || 4003;
const app = Fastify();
app.register(appRoutes);
app.register(cors);
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
//# sourceMappingURL=server.js.map