import { Request, Response } from 'express';
import { z } from 'zod';
import { dbStore, saveJsonStore } from '../db/jsonStore.js';
import { dbService } from '../db/mongodb.js';
import { sendContactNotificationEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';
import { ContactMessage } from '../../src/types.js';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message content is required'),
});

export const submitContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const validated = contactSchema.parse(req.body);

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: validated.name.trim(),
      email: validated.email.trim(),
      subject: validated.subject.trim(),
      message: validated.message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // 1. Save to Memory / JSON DB
    dbStore.messages.unshift(newMsg);
    saveJsonStore();

    // 2. Save to MongoDB if connected
    const db = dbService.getDb();
    if (db) {
      await db.collection('messages').insertOne({ ...newMsg, _id: newMsg.id } as any).catch((err) => {
        logger.error('Failed to insert message into MongoDB', err);
      });
    }

    // 3. Dispatch Notification Email
    const emailResult = await sendContactNotificationEmail({
      name: newMsg.name,
      email: newMsg.email,
      subject: newMsg.subject,
      message: newMsg.message,
      createdAt: new Date(newMsg.createdAt).toLocaleString(),
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully and saved to the database.',
      data: newMsg,
      emailDispatched: emailResult.success,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues.map((e) => e.message),
      });
      return;
    }

    logger.error('Error submitting contact message', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message submission.',
    });
  }
};

export const getAllMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = dbService.getDb();
    if (db) {
      const docs = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray();
      const messages = docs.map((doc) => {
        const { _id, ...rest } = doc;
        return { id: (doc.id || _id?.toString()) as string, ...rest } as ContactMessage;
      });
      res.json({ success: true, messages });
      return;
    }

    res.json({ success: true, messages: dbStore.messages || [] });
  } catch (error) {
    logger.error('Error fetching contact messages', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    dbStore.messages = dbStore.messages.filter((m) => m.id !== id);
    saveJsonStore();

    const db = dbService.getDb();
    if (db) {
      await db.collection('messages').deleteOne({ $or: [{ id }, { _id: id }] } as any);
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    logger.error('Error deleting message', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
};

export const toggleMessageReadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const msg = dbStore.messages.find((m) => m.id === id);

    if (msg) {
      msg.read = !msg.read;
      saveJsonStore();

      const db = dbService.getDb();
      if (db) {
        await db.collection('messages').updateOne(
          { $or: [{ id }, { _id: id }] } as any,
          { $set: { read: msg.read } }
        );
      }

      res.json({ success: true, data: msg });
      return;
    }

    res.status(404).json({ success: false, message: 'Message not found' });
  } catch (error) {
    logger.error('Error updating message read status', error);
    res.status(500).json({ success: false, message: 'Failed to update message' });
  }
};
