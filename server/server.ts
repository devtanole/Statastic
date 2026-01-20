/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  errorMiddleware,
  authMiddleware,
  Auth,
  FightRecord,
  Fighter,
  User,
  Measurement,
  NewFightRecord,
  NewFighter,
  NewMeasurement,
} from './lib/index.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { fullName, username, password } = req.body;
    if (!fullName || !username || !password) {
      throw new ClientError(400, 'a required field is missing');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
    insert into "users" ("fullName", "username", "hashedPassword", createdAt, updatedAt)
    values ($1, $2, $3, now(), now())
    returning "userId", "fullName", "username", "createdAt";
    `;
    const params = [fullName, username, hashedPassword];
    const result = await db.query(sql, params);
    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required');
    }
    const sql = `
    select "userId",
            "username",
            "hashedPassword"
        from "users"
        where "username" = $1;
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(401, 'invalid login, user not found');
    }
    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new ClientError(401, 'invalid login, invalid password');
    }
    const payload = {
      userId: user.userId,
      username: user.username,
    };
    const newSignedToken = jwt.sign(payload, tokenSecret, {
      expiresIn: '1h',
    });
    res.status(200).json({
      user: payload,
      token: newSignedToken,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/fighters', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
    select f."fighterId",
    f."firstName",
    f."lastName",
    f."dob",
    f."finishes",
    f."weightMisses",
    f."pullOuts",
    m."height",
    m."weight",
    m."dateRecorded" as "lastMeasuredAt"
    from "fighters" f
    left join (
      select distinct on ("fighterId")
        "fighterId",
        "height",
        "weight",
        "dateRecorded"
      from "measurements"
      order by "fighterId", "dateRecorded" desc
    ) m on f."fighterId" = m."fighterId"
    order by f."lastName" asc, f."firstName" asc;
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/fighters/:fighterId', authMiddleware, async (req, res, next) => {
  try {
    const { fighterId } = req.params;
    if (fighterId === undefined) {
      throw new ClientError(400, `fighterId not found`);
    }
    const sql = `
    select
      f."fighterId",
        f."firstName",
        f."lastName",
        f."dob",
        f."finishes",
        f."weightMisses",
        f."pullOuts",
        f."notes",
        m."height",
        m."weight",
        m."dateRecorded" as "lastMeasuredAt"
      from "fighters" f
      left join (
        select distinct on ("fighterId")
          "fighterId",
          "height",
          "weight",
          "dateRecorded"
        from "measurements"
        order by "fighterId", "dateRecorded" desc
      ) m on f."fighterId" = m."fighterId"
      where f."fighterId" = $1;
    `;
    const params = [fighterId];
    const result = await db.query(sql, params);
    const fighter = result.rows[0];
    if (!fighter) {
      throw new ClientError(404, `fighter ${fighterId} not found`);
    }
    res.json(fighter);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/fighters/:fighterId/measurements',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { fighterId } = req.params;
      const sql = `
    select "measurementId", "fighterId", "height", "weight", "dateRecorded"
    from "measurements"
    where "fighterId" = $1
    order by "dateRecorded" desc
    limit 5;
    `;

      const params = [fighterId];
      const result = await db.query<Measurement>(sql, params);
      const measurements = result.rows;
      res.json(measurements);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/fighters/:fighterId/fights',
  authMiddleware,
  async (req, res, next) => {
    try {
      const fighterId = Number(req.params.fighterId);

      if (!Number.isInteger(fighterId)) {
        throw new ClientError(400, 'fighterId must be an integer');
      }
      const sql = `
      select * from "fightRecords"
      where "fighterId" = $1
      order by "date" desc;
    `;
      const params = [fighterId];
      const result = await db.query(sql, params);
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/fighters/:fighterId/fights/:fightId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const fightId = Number(req.params.fightId);

      if (!Number.isInteger(fightId)) {
        throw new ClientError(400, 'fightId must be an integer');
      }

      const sql = `
      select *
      from "fightRecords"
      where "fightId" = $1;
    `;

      const params = [fightId];

      const result = await db.query(sql, params);

      const fight = result.rows[0];

      if (!fight) {
        throw new ClientError(404, `fight ${fightId} not found`);
      }

      res.json(fight);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/fighters', authMiddleware, async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      finishes,
      weightMisses,
      pullOuts,
      notes,
    } = req.body as Partial<Fighter>;
    if (!firstName || !lastName || !dob) {
      throw new ClientError(400, 'firstName, lastName and dob are required');
    }
    const sql = `
    insert into "fighters" ("firstName", "lastName", "dob", "finishes", "weightMisses", "pullOuts", "notes")
    values ($1, $2, $3, $4, $5, $6, $7)
    returning *;
    `;
    const params = [
      firstName,
      lastName,
      dob,
      finishes ?? 0,
      weightMisses ?? 0,
      pullOuts ?? 0,
      notes ?? null,
    ];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/fighters/:fighterId/measurements', async (req, res, next) => {
  try {
    const { fighterId } = req.params;
    const { height, weight, dateRecorded } = req.body;
    if (!height || !weight || !dateRecorded || !fighterId) {
      throw new ClientError(400, 'a required field is missing');
    }
    const sql = `
  insert into "measurements" ("fighterId", "height", "weight", "dateRecorded")
  values ($1, $2, $3, $4)
  returning *;
  `;
    const params = [fighterId, height, weight, dateRecorded];
    const result = await db.query<Measurement>(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/fighters/:fighterId/fights', async (req, res, next) => {
  try {
    const { fighterId } = req.params;
    const { date, outcome, method, promotion } = req.body;

    if (!fighterId || !outcome) {
      throw new ClientError(400, 'fighterId and outcome are required');
    }
    const sql = `
    insert into "fightRecords" ("fighterId", "date", "outcome", "method", "promotion")
    values ($1, $2, $3, $4, $5)
    returning *
    `;
    const params = [
      fighterId,
      date,
      outcome,
      method ?? null,
      promotion ?? null,
    ];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete(
  '/api/fighters/:fighterId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { fighterId } = req.params;
      if (!Number.isInteger(+fighterId)) {
        throw new ClientError(400, `Non-integer fighterId: ${fighterId}`);
      }
      const sql = `
    delete from "fighters"
    where "fighterId" = $1
    returning *;
    `;
      const params = [fighterId];
      const result = await db.query(sql, params);
      const [fighter] = result.rows;
      if (!fighter)
        throw new ClientError(404, `fighter ${fighterId} not found`);
      res.status(200).json(fighter);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/fighters/:fighterId/fights/:fightId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { fightId, fighterId } = req.params;
      if (!Number.isInteger(+fightId)) {
        throw new ClientError(400, `Non-integer fightId: ${fightId}`);
      }
      if (!Number.isInteger(fighterId)) {
        throw new ClientError(400, `Non-integer fighterId: ${fighterId}`);
      }
      const sql = `
    delete from "fightRecords"
    where "fightId" = $1 and "fighterId" = $2
    returning *;
    `;
      const params = [fightId, fighterId];
      const result = await db.query(sql, params);
      const [fight] = result.rows;
      if (!fight) {
        throw new ClientError(404, `fightId ${fightId} not found`);
      }
      res.status(200).json(fight);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/fighters/:fighterId/measurements/:measurementId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { fighterId, measurementId } = req.params;
      if (!Number.isInteger(fighterId)) {
        throw new ClientError(400, `invalid fighterId: ${fighterId}`);
      }

      if (!Number.isInteger(measurementId)) {
        throw new ClientError(400, `invalid measurementId: ${measurementId}`);
      }
      const sql = `
      delete from "measurements"
      where "measurementId" = $1 and "fighterId" = $2
      returning *;
      `;
      const params = [measurementId, fighterId];
      const result = await db.query(sql, params);
      const [measurement] = result.rows;
      if (!measurement) {
        throw new ClientError(
          404,
          `measurement ${measurementId} not found for fighter ${fighterId}`
        );
      }
      res.status(200).json(measurement);
    } catch (err) {
      next(err);
    }
  }
);

app.put('/api/fighters/:fighterId', authMiddleware, async (req, res, next) => {
  try {
    const fighterId = Number(req.params.fighterId);
    if (!Number.isInteger(fighterId) || fighterId < 1) {
      throw new ClientError(400, 'fighterId must be a positive integer');
    }
    const {
      firstName,
      lastName,
      dob,
      finishes,
      weightMisses,
      pullOuts,
      notes,
    } = req.body as Partial<Fighter>;
    if (!firstName || !lastName || !dob) {
      throw new ClientError(400, 'firstName, lastName and dob are required');
    }
    const sql = `
    update "fighters"
      set "updatedAt" = now(),
          "firstName" = $1,
          "lastName" = $2,
          "dob" = $3,
          "finishes" = $4,
          "weightMisses" = $5,
          "pullOuts" = $6,
          "notes" = $7
        where "fighterId" = $8
        returning *;
    `;
    const params = [
      firstName,
      lastName,
      dob,
      finishes ?? 0,
      weightMisses ?? 0,
      pullOuts ?? 0,
      notes ?? null,
      fighterId,
    ];
    const result = await db.query(sql, params);
    const updatedFighter = result.rows[0];
    if (!updatedFighter) {
      throw new ClientError(
        404,
        `cannot find fighter of fighterId ${fighterId}`
      );
    }
    res.json(updatedFighter);
  } catch (err) {
    next(err);
  }
});

app.put(
  '/api/fighters/:fighterId/measurements/:measurementId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const fighterId = Number(req.params.fighterId);
      const measurementId = Number(req.params.measurementId);
      if (!Number.isInteger(fighterId) || fighterId < 1) {
        throw new ClientError(400, 'fighterId must be a positive integer');
      }
      if (!Number.isInteger(measurementId) || measurementId < 1) {
        throw new ClientError(400, 'measurementId must be a positive integer');
      }
      const { height, weight, dateRecorded } = req.body;
      if (!height || !weight || !dateRecorded) {
        throw new ClientError(
          400,
          'height, weight and dateRecorded are required'
        );
      }
      const sql = `
    update "measurements"
      set "height" = $1,
          "weight" = $2,
          "dateRecorded" = $3
        where "measurementId" = $4 and "fighterId" = $5
        returning *;
    `;
      const params = [height, weight, dateRecorded, measurementId, fighterId];
      const result = await db.query(sql, params);
      const updatedMeasurement = result.rows[0];
      if (!updatedMeasurement) {
        throw new ClientError(
          404,
          `cannot find measurementId of ${measurementId}`
        );
      }
      res.json(updatedMeasurement);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/fighters/:fighterId/fights/:fightId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const fighterId = Number(req.params.fighterId);
      const fightId = Number(req.params.fightId);
      if (!Number.isInteger(fighterId) || fighterId < 1) {
        throw new ClientError(400, 'fighterId must be a positive integer');
      }
      if (!Number.isInteger(fightId) || fightId < 1) {
        throw new ClientError(400, 'fightId must be a positive integer');
      }
      const { date, outcome, method, promotion } =
        req.body as Partial<FightRecord>;
      if (!outcome) {
        throw new ClientError(400, 'outcome required');
      }
      const sql = `
      update "fightRecords"
        set "updatedAt" = now(),
            "date" = $1,
            "outcome" = $2,
            "method" = $3,
            "promotion" = $4
          where "fightId" = $5 and "fighterId" = $6
          returning *;
      `;
      const params = [date, outcome, method, promotion, fightId, fighterId];
      const result = await db.query(sql, params);
      const updatedFight = result.rows[0];
      if (!updatedFight) {
        throw new ClientError(404, `cannot find fight of fightId: ${fightId}`);
      }
      res.json(updatedFight);
    } catch (err) {
      next(err);
    }
  }
);

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
  console.log('mission stat tracker');
});
