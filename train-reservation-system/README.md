# Train Ticket Management Portal

A beginner-friendly train reservation project built with React, Vite, and Supabase. Travelers can search trains by source and destination, make a reservation, look up reservations by email, and cancel a reservation.

## What You Need

- Node.js and npm
- A free Supabase project

## Run the Project

1. Open a terminal in this project folder (`train-reservation-system`).
2. Install the packages:

   ```sh
   npm install
   ```

3. Copy `.env.example` to a new file named `.env`.
4. In Supabase, open **Project Settings > API**. Copy the project URL and anon/publishable key into `.env`:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
   ```

5. In the Supabase dashboard, open **SQL Editor**, paste the contents of `supabase-setup.sql`, and run it once.
6. Start the website:

   ```sh
   npm run dev
   ```

   Open the local URL printed in the terminal. If the dev server was already running when you changed `.env`, stop it and start it again.

## Try It

1. Search for `Bengaluru` to `Chennai` and choose a travel date and passenger count.
2. Select **Book Now**, enter a name and email, and confirm the booking.
3. Open **My Reservations** and search using that email.
4. Cancel the reservation to see its status change.

The SQL setup adds example train records so the search has results to display.

## Project Structure

- `src/pages/` contains the home, search results, booking, and reservations pages.
- `src/components/` contains shared navigation, footer, and train-card components.
- `src/services/supabase.js` creates the Supabase client.
- `supabase-setup.sql` creates the two tables and example data.

## Useful Commands

```sh
npm run dev
npm run lint
npm run build
```

## Beginner Project Notes

- Train search currently matches source and destination. The selected date is saved with the reservation; it is not used to filter train schedules.
- The example app does not update the train's seat count after a booking or cancellation. Availability is for demonstration only, so concurrent bookings could exceed the displayed number of seats.
- The SQL policies are intentionally open to the Supabase `anon` role to keep this classroom demo simple. Anyone with the app can read and change demo reservations. Use fake data only; do not use these policies or real personal data for a public service.
- Keep your `.env` file private. It is ignored by Git. The browser app uses a public anon/publishable key, so database access must be controlled with Supabase policies.

Authentication, payment processing, and live seat inventory are outside this beginner project's scope.