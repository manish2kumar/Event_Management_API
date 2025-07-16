const pool = require('../db');

// POST-> /api/events
const createEvent = async (req, res) => {
  const { title, date_time, location, capacity } = req.body;
  if (!title || !date_time || !location || !capacity) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (capacity <= 0 || capacity > 1000) {
    return res.status(400).json({ error: 'Capacity must be between 1 and 1000' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, date_time, location, capacity]
    );
    res.status(201).json({ event_id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Server error creating event' });
  }
};

// GET /api/events/:id
const getEventDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const eventQuery = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const userQuery = await pool.query(
      `SELECT u.id, u.name, u.email FROM users u
       JOIN registrations r ON u.id = r.user_id WHERE r.event_id = $1`,
      [id]
    );

    const event = eventQuery.rows[0];
    event.registrations = userQuery.rows;
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching event details' });
  }
};

// POST-> /api/events/:id/register
const registerForEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const { user_id } = req.body;

  try {
    const [event, reg] = await Promise.all([
      pool.query('SELECT * FROM events WHERE id = $1', [eventId]),
      pool.query('SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2', [eventId, user_id])
    ]);

    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const e = event.rows[0];

    if (new Date(e.date_time) < new Date()) {
      return res.status(400).json({ error: 'Cannot register for past event' });
    }

    if (reg.rows.length > 0) {
      return res.status(400).json({ error: 'User already registered' });
    }

    const regCount = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [eventId]);
    if (parseInt(regCount.rows[0].count) >= e.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }

    await pool.query('INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)', [user_id, eventId]);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// DELETE-> /api/events/:id/register
const cancelRegistration = async (req, res) => {
  const { id: eventId } = req.params;
  const { user_id } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2', [eventId, user_id]);
    if (existing.rows.length === 0) {
      return res.status(400).json({ error: 'User is not registered for this event' });
    }

    await pool.query('DELETE FROM registrations WHERE event_id = $1 AND user_id = $2', [eventId, user_id]);
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
};

// GET-> /api/events/upcoming
const listUpcomingEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events WHERE date_time > CURRENT_TIMESTAMP ORDER BY date_time ASC, location ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching upcoming events' });
  }
};

// GET-> /api/events/:id/stats
const getEventStats = async (req, res) => {
  const { id: eventId } = req.params;
  try {
    const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (event.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const capacity = event.rows[0].capacity;
    const count = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [eventId]);
    const total = parseInt(count.rows[0].count);
    const percentage = ((total / capacity) * 100).toFixed(2);

    res.json({
      total_registrations: total,
      remaining_capacity: capacity - total,
      percentage_filled: percentage + '%',
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

module.exports = {
  createEvent,
  getEventDetails,
  registerForEvent,
  cancelRegistration,
  listUpcomingEvents,
  getEventStats,
};
