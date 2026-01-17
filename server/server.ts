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
