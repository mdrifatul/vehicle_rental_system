import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateUser = async (
  id: string,
  payload: Record<string, unknown>,
  req: any
) => {
  const update: string[] = [];
  const value: any[] = [];
  let paramCount = 1;
  for (const key in payload) {
    if (payload[key] !== undefined) {
      update.push(`${key}=$${paramCount}`);
      value.push(payload[key]);
      paramCount++;
    }
  }
  if (req?.user.role === "customer") {
    if (req?.user.id !== Number(id)) {
      console.log(id);
      return { message: "You are not allowd" };
    }
  }

  value.push(id);

  const result = await pool.query(
    `UPDATE users SET ${update.join(", ")} WHERE id=$${paramCount} RETURNING *`,
    value
  );
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userService = {
  getUser,
  updateUser,
  deleteUser,
};
