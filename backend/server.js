import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import kbRoutes from './routes/kbRoutes.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/kb', kbRoutes);

app.get('/', (req, res) => {
    res.send('Deskora API is running...');
});

// Socket.io basics
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_ticket', (ticketId) => {
        socket.join(ticketId);
        console.log(`User joined ticket: ${ticketId}`);
    });

    socket.on('send_message', (data) => {
        // data should contain ticketId, content, sender info, etc.
        io.to(data.ticket).emit('receive_message', data);
    });

    socket.on('create_ticket', (ticket) => {
        // Broadcast to everyone that a new ticket exists
        io.emit('new_ticket_alert', ticket); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
