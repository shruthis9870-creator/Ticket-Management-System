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

5. Set up the Supabase tables and example trains:

   - For a new database, run `supabase-setup.sql` once. It creates the tables and adds two example trains.
   - If your tables already exist, run `supabase-admin-policy.sql` to allow the demo Admin page to insert trains. Run `supabase-seed-trains.sql` if you also want 56 example trains across 14 two-way routes.

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
5. Open **Admin** in the navigation to view train/reservation data and add a train.

The SQL setup adds example train records so the search has results to display.

You can search routes between Bengaluru, Chennai, Hyderabad, Mumbai, Pune, Delhi, Jaipur, Lucknow, Varanasi, Kolkata, Bhubaneswar, Kochi, Goa, Ahmedabad, and Bhopal. These schedules and train numbers are fictional sample data, not live railway information.

## Project Structure

- `src/pages/` contains the home, search results, booking, and reservations pages.
- `src/components/` contains shared navigation, footer, and train-card components.
- `src/services/supabase.js` creates the Supabase client.
- `supabase-setup.sql` creates the two tables and example data.
- `supabase-admin-policy.sql` adds the train insert policy to an existing demo database.
- `supabase-seed-trains.sql` adds sample train rows to existing tables.

## Useful Commands

```sh
npm run dev
npm run lint
npm run build
```

## Beginner Project Notes

- Train search matches either source/destination or an optional train number. All stored train rows are treated as daily services; the selected date is saved with the reservation but does not filter schedules.
- The example app does not update the train's seat count after a booking or cancellation. Availability is for demonstration only, so concurrent bookings could exceed the displayed number of seats.
- Train read/insert policies allow the Supabase `anon` and `authenticated` roles, while the demo reservation policies allow `anon` access. The Admin route has no authentication, so anyone can open it and add trains. Use fake data only; do not use these demo policies or real personal data for a public service.
- Keep your `.env` file private. It is ignored by Git. The browser app uses a public anon/publishable key, so database access must be controlled with Supabase policies.

Authentication, payment processing, and live seat inventory are outside this beginner project's scope.