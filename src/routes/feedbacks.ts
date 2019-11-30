import { Router } from 'express';
import { sendFeedback } from '../core/slack';

const feedbacks = Router();

feedbacks.post('/', async (req, res, next) => {
  try {
    sendFeedback(req.body.message, req.body.messageType);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

export default feedbacks;
