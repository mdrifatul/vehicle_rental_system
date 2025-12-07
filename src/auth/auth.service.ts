import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const signUp = async (Payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = Payload;

  const hashPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashPassword, phone, role]
  );
  return result;
};

const signIn = async (Payload: Record<string, unknown>) => {
  const { email, password } = Payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    return false;
  }
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtsecret as string,
    { expiresIn: "10d" }
  );
  return { token, user };
};

export const userSignup = {
  signUp,
  signIn,
};
