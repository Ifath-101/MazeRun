import express from 'express';
import Score from './models/score.js';
import { checkIRStatus } from './arduinoService.js';
import cors from 'cors'
import mongoose from 'mongoose'

const router = express.Router();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/', router);

mongoose.connect('mongodb+srv://admin:Maze404@cluster0.pi7pfra.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

router.get('/ir', (req, res) => {
  const status = checkIRStatus();
  res.json(status);
});

router.post('/save', async (req, res) => {
  const { name, time } = req.body;
  const saved = await Score.create({ name, time });
  res.json({ success: true, data: saved });
});

router.get('/highscores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ time: 1 });
    res.status(200).json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching scores", error: err });
  }
});

export default router;
