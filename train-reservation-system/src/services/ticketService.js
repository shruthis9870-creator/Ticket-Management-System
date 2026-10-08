import { supabase } from "./supabase";

const SEED_TRAINS = [
    {
        id: 1,
        train_number: "12007",
        train_name: "Shatabdi Express",
        source: "Bengaluru",
        destination: "Chennai",
        departure_time: "06:00",
        arrival_time: "10:50",
        duration: "4h 50m",
        seats_available: 28,
        price: 850,
        train_class: "CC",
    },
    {
        id: 2,
        train_number: "99901",
        train_name: "Example Intercity",
        source: "Bengaluru",
        destination: "Chennai",
        departure_time: "07:30",
        arrival_time: "13:00",
        duration: "5h 30m",
        seats_available: 40,
        price: 700,
        train_class: "2S",
    },
    {
        id: 3,
        train_number: "20608",
        train_name: "Vande Bharat Express",
        source: "Bengaluru",
        destination: "Chennai",
        departure_time: "14:20",
        arrival_time: "18:50",
        duration: "4h 30m",
        seats_available: 35,
        price: 1120,
        train_class: "EC",
    },
    {
        id: 4,
        train_number: "12640",
        train_name: "Brindavan Express",
        source: "Bengaluru",
        destination: "Chennai",
        departure_time: "15:10",
        arrival_time: "21:15",
        duration: "6h 05m",
        seats_available: 52,
        price: 540,
        train_class: "2S",
    },
    {
        id: 5,
        train_number: "12008",
        train_name: "Shatabdi Express",
        source: "Chennai",
        destination: "Bengaluru",
        departure_time: "15:30",
        arrival_time: "20:00",
        duration: "4h 30m",
        seats_available: 45,
        price: 850,
        train_class: "CC",
    },
    {
        id: 6,
        train_number: "12952",
        train_name: "Mumbai Rajdhani",
        source: "Mumbai",
        destination: "Delhi",
        departure_time: "17:00",
        arrival_time: "08:35",
        duration: "15h 35m",
        seats_available: 18,
        price: 2450,
        train_class: "1A",
    },
    {
        id: 7,
        train_number: "12951",
        train_name: "Rajdhani Express",
        source: "Delhi",
        destination: "Mumbai",
        departure_time: "16:55",
        arrival_time: "08:30",
        duration: "15h 35m",
        seats_available: 22,
        price: 2450,
        train_class: "1A",
    },
    {
        id: 8,
        train_number: "12786",
        train_name: "Kacheguda SF Express",
        source: "Bengaluru",
        destination: "Hyderabad",
        departure_time: "18:20",
        arrival_time: "05:40",
        duration: "11h 20m",
        seats_available: 60,
        price: 920,
        train_class: "3A",
    },
];

const LOCAL_STORAGE_KEY = "railease_local_reservations";

function getLocalReservations() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveLocalReservations(reservations) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
        console.error("Failed to save to localStorage:", e);
    }
}

function isSupabaseConfigured() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(
        url &&
        key &&
        !url.includes("your-project-id") &&
        !url.includes("placeholder")
    );
}

/**
 * Searches for trains. Tries Supabase first; falls back gracefully to seed data.
 */
export async function searchTrains(from, to) {
    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from("trains")
                .select("*")
                .ilike("source", `%${from}%`)
                .ilike("destination", `%${to}%`)
                .order("departure_time");

            if (!error && data && data.length > 0) {
                return { trains: data, isDemo: false };
            }
        } catch (e) {
            console.warn("Supabase query failed, falling back to local data:", e);
        }
    }

    // Local fallback matching
    const qFrom = from.trim().toLowerCase();
    const qTo = to.trim().toLowerCase();

    const matched = SEED_TRAINS.filter(
        (t) =>
            t.source.toLowerCase().includes(qFrom) &&
            t.destination.toLowerCase().includes(qTo)
    );

    if (matched.length > 0) {
        return { trains: matched, isDemo: true };
    }

    // Dynamic fallback for any user-entered stations so demo always lets them test
    const customTrains = [
        {
            id: 101,
            train_number: "22801",
            train_name: `${from} - ${to} Superfast`,
            source: from,
            destination: to,
            departure_time: "07:15",
            arrival_time: "13:30",
            duration: "6h 15m",
            seats_available: 42,
            price: 780,
            train_class: "CC",
        },
        {
            id: 102,
            train_number: "12904",
            train_name: `${from} Intercity Express`,
            source: from,
            destination: to,
            departure_time: "15:40",
            arrival_time: "21:50",
            duration: "6h 10m",
            seats_available: 30,
            price: 620,
            train_class: "2S",
        },
    ];

    return { trains: customTrains, isDemo: true };
}

/**
 * Creates a new reservation and returns the full ticket object with PNR.
 */
export async function bookTicket({ passenger_name, email, train, travel_date, seats, total_amount }) {
    const pnr = `RL${Math.floor(100000 + Math.random() * 900000)}`;
    let reservationId = Date.now();
    let savedToSupabase = false;

    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from("reservations")
                .insert([
                    {
                        passenger_name,
                        email,
                        train_id: train.id,
                        travel_date,
                        seats,
                        total_amount,
                        status: "Confirmed",
                    },
                ])
                .select();

            if (!error && data && data.length > 0) {
                reservationId = data[0].id;
                savedToSupabase = true;
            }
        } catch (e) {
            console.warn("Supabase insert failed, caching locally:", e);
        }
    }

    const ticket = {
        id: reservationId,
        pnr,
        passenger_name,
        email,
        train_id: train.id,
        train,
        trains: train,
        travel_date,
        seats,
        total_amount,
        status: "Confirmed",
        created_at: new Date().toISOString(),
        savedToSupabase,
    };

    // Always mirror to local storage so user never loses their ticket during tests
    const localList = getLocalReservations();
    localList.unshift(ticket);
    saveLocalReservations(localList);

    return ticket;
}

/**
 * Retrieves reservations by passenger email.
 */
export async function getReservations(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    let supabaseResults = [];

    if (isSupabaseConfigured()) {
        try {
            const { data, error } = await supabase
                .from("reservations")
                .select(`
                    *,
                    trains (
                        train_number,
                        train_name,
                        source,
                        destination,
                        departure_time,
                        arrival_time,
                        duration,
                        train_class,
                        price
                    )
                `)
                .ilike("email", cleanEmail);

            if (!error && data) {
                supabaseResults = data.map((item) => ({
                    ...item,
                    train: item.trains,
                    pnr: item.pnr || `RL${String(item.id).padStart(6, "0")}`,
                }));
            }
        } catch (e) {
            console.warn("Supabase query failed, falling back to local storage:", e);
        }
    }

    // Merge with local storage results
    const localList = getLocalReservations();
    const localFiltered = localList.filter(
        (r) => (r.email || "").trim().toLowerCase() === cleanEmail
    );

    // Deduplicate by id
    const seenIds = new Set(supabaseResults.map((r) => String(r.id)));
    const merged = [...supabaseResults];
    for (const item of localFiltered) {
        if (!seenIds.has(String(item.id))) {
            merged.push(item);
        }
    }

    return merged;
}

/**
 * Cancels a reservation.
 */
export async function cancelReservation(id) {
    if (isSupabaseConfigured()) {
        try {
            await supabase
                .from("reservations")
                .update({ status: "Cancelled" })
                .eq("id", id);
        } catch (e) {
            console.warn("Supabase cancellation update failed:", e);
        }
    }

    // Update local storage
    const localList = getLocalReservations();
    const updated = localList.map((item) =>
        String(item.id) === String(id) ? { ...item, status: "Cancelled" } : item
    );
    saveLocalReservations(updated);

    return true;
}
