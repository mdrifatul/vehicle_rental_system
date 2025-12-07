import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    status,
  }: any = payload;

  const vehicles = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  const vehicle = vehicles.rows[0];

  if (vehicle.availability_status !== "available") {
    return { message: "vehicle not available" };
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const duration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (duration <= 0) {
    return { message: "End date must be after start date" };
  }

  const total_price = vehicle.daily_rent_price * duration;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id=$1`,
    [vehicle_id]
  );

  const booking = {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };

  return booking;
};

const getBooking = async (req: any) => {
  const bookings = await pool.query(`SELECT * FROM bookings`);
  const users = await pool.query(`SELECT * FROM users`);
  const vehicles = await pool.query(`SELECT * FROM vehicles`);

  if (req.user?.role === "admin") {
    const booking = bookings.rows.map((book) => {
      const customer = users.rows.find((user) => user.id === book.customer_id);
      const vehicle = vehicles.rows.find((veh) => veh.id === book.vehicle_id);

      return {
        ...book,
        customer: {
          name: customer?.name,
          email: customer?.email,
        },
        vehicle: {
          vehicle_name: vehicle?.vehicle_name,
          registration_number: vehicle?.registration_number,
        },
      };
    });

    return booking;
  }

  const userBookings = bookings.rows.filter(
    (book) => book.customer_id === req.user?.id
  );

  const result = userBookings.map((book) => {
    const vehicle = vehicles.rows.find((veh) => veh.id === book.vehicle_id);

    return {
      ...book,
      vehicle: {
        vehicle_name: vehicle?.vehicle_name,
        registration_number: vehicle?.registration_number,
      },
    };
  });

  return result;
};

const updateBooking = async (id: string, req: any) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    id,
  ]);
  const reqUser = req?.user;
  const booking = bookingRes.rows[0];

  const date = new Date();
  const startDate = new Date(booking.rent_start_date);
  const endDate = new Date(booking.rent_end_date);

  if (reqUser.role === "customer") {
    if (booking.customer_id !== reqUser.id) {
      return { message: "You are not allowed to cancel" };
    }

    if (date > startDate) {
      return { message: "Booking can not cancelled after start" };
    }

    const updateBooking = await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [id]
    );

    return updateBooking.rows[0];
  }

  if (reqUser.role === "admin") {
    const updateBooking = await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [id]
    );

    const updateVehicles = await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1 RETURNING *`,
      [booking.vehicle_id]
    );
    const updateByAdmin = {
      ...updateBooking.rows[0],
      vehicle: {
        availability_status: updateVehicles.rows[0]?.availability_status,
      },
    };

    return updateByAdmin;
  }
  if (date < endDate) {
    await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [id]
    );
    return { message: "Booking cancelled" };
  }

  return { message: "you are not allowed" };
};

export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
