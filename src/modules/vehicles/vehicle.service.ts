import { pool } from "../../config/db";

const createVehicle = async (Payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = Payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getVehicle = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingle = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicle = async (id: string, Payload: Record<string, unknown>) => {
  const fields: string[] = [];
  const value: any[] = [];
  let paramCount = 1;
  for (const field in Payload) {
    if (Payload[field] !== undefined) {
      fields.push(`${field}=$${paramCount}`);
      value.push(Payload[field]);
      paramCount++;
    }
  }
  value.push(id);

  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(
      ", "
    )} WHERE id=$${paramCount} RETURNING *`,
    value
  );
  return result;
};

const deleteVehile = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  if (
    result.rows.length > 0 &&
    result.rows[0].availability_status === "booked"
  ) {
    return false;
  }
  return result;
};

export const vechileService = {
  createVehicle,
  getVehicle,
  getSingle,
  updateVehicle,
  deleteVehile,
};
