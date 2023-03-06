import Fastify from 'fastify';
import cors from '@fastify/cors'
import { appRoutes } from './routes';


const app = Fastify();
app.register(appRoutes)

app.register(cors)


app.listen({
    port: 3000,
}).then(()=>{
    console.log('Server started on port 3000');
})