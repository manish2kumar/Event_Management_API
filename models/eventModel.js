const pool = require('../db');

const createEventInDB = async ({ title, date_time, location, capacity }) => {
  const query = `
    INSERT INTO events (title, date_time, location, capacity)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

  const values = [title, date_time, location, capacity];
  const result = await pool.query(query, values);

  return result.rows[0].id;
};

module.exports = {
  createEventInDB,
};
