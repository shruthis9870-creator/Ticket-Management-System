import { jsPDF } from "jspdf";

/**
 * Generates and styles a high-quality electronic train ticket PDF.
 * @param {Object} ticket - Reservation and train details
 * @returns {jsPDF}
 */
export function generateTicketPDF(ticket) {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const reservationId = ticket.id || String(Date.now()).slice(-6);
    const pnr = ticket.pnr || `RL${String(reservationId).padStart(6, "0")}`;
    const passengerName = ticket.passenger_name || "Traveler";
    const email = ticket.email || "N/A";
    const travelDate = ticket.travel_date || new Date().toISOString().split("T")[0];
    const seats = Number(ticket.seats) || 1;
    const totalAmount = Number(ticket.total_amount) || 0;
    const status = (ticket.status || "Confirmed").toUpperCase();
    const isCancelled = status === "CANCELLED";

    // Train information fallback
    const train = ticket.train || ticket.trains || {};
    const trainName = train.train_name || "Intercity Express";
    const trainNumber = train.train_number || "12007";
    const source = (train.source || "Origin").toUpperCase();
    const destination = (train.destination || "Destination").toUpperCase();
    const depTime = train.departure_time || "06:00";
    const arrTime = train.arrival_time || "11:30";
    const duration = train.duration || "5h 30m";
    const trainClass = train.train_class || "CC";
    const basePrice = train.price ? Number(train.price) : (totalAmount / (seats || 1));

    // Outer ticket frame
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    doc.roundedRect(12, 12, 186, 268, 4, 4, "S");

    // Header Banner
    doc.setFillColor(15, 30, 60);
    doc.roundedRect(12, 12, 186, 34, 4, 4, "F");
    doc.rect(12, 42, 186, 4, "F");

    // Header Logo & Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text("RAILEASE EXPRESS", 20, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(191, 219, 254);
    doc.text("ELECTRONIC RESERVATION SLIP (ERS) • PASSENGER TICKET", 20, 32);

    // Status Badge
    if (isCancelled) {
        doc.setFillColor(185, 28, 28); // Red
        doc.roundedRect(144, 18, 46, 9, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text("CANCELLED", 153, 24);
    } else {
        doc.setFillColor(22, 101, 52); // Green
        doc.roundedRect(144, 18, 46, 9, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text("CONFIRMED", 154, 24);
    }

    doc.setTextColor(253, 224, 71); // Gold
    doc.setFontSize(9.5);
    doc.text(`PNR: ${pnr}`, 147, 34);

    // Journey Card
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(18, 50, 174, 40, 3, 3, "F");

    // Departure
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(source, 26, 65);
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(depTime, 26, 73);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("DEPARTURE STATION", 26, 79);

    // Arrow & Duration
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`------->  ${duration}  ------->`, 76, 67);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("DIRECT NON-STOP ROUTE", 84, 75);

    // Arrival
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(destination, 140, 65);
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(arrTime, 140, 73);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("ARRIVAL STATION", 140, 79);

    // Train Metadata Bar
    doc.setDrawColor(226, 232, 240);
    doc.line(18, 96, 192, 96);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Train: ${trainNumber} - ${trainName}`, 20, 103);
    doc.text(`Travel Date: ${travelDate}`, 90, 103);
    doc.text(`Class: ${trainClass} • Quota: GN`, 146, 103);

    // Perforation line
    doc.setLineDashPattern([2, 2], 0);
    doc.setDrawColor(148, 163, 184);
    doc.line(12, 110, 198, 110);
    doc.setLineDashPattern([], 0);

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("- - - - - - - - - - - - - -  OFFICIAL BOARDING PASS & PASSENGER RECORD  - - - - - - - - - - - - - -", 32, 114);

    // Passenger Details Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(18, 119, 174, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("PRIMARY PASSENGER", 22, 125);
    doc.text("REGISTERED EMAIL", 72, 125);
    doc.text("SEATS BOOKED", 125, 125);
    doc.text("BERTH / STATUS", 152, 125);

    // Passenger Details Table Row
    doc.setFillColor(248, 250, 252);
    doc.rect(18, 128, 174, 13, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(passengerName, 22, 136);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(email, 72, 136);

    doc.setFont("helvetica", "bold");
    doc.text(`${seats} Seat(s)`, 128, 136);

    if (isCancelled) {
        doc.setTextColor(185, 28, 28);
        doc.text("CANCELLED", 152, 136);
    } else {
        doc.setTextColor(22, 101, 52);
        doc.text(`CNF / B1-${10 + seats}`, 152, 136);
    }

    // Fare & Payment Breakdown Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(18, 146, 174, 32, 2, 2, "F");

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("Base Ticket Fare (per seat):", 24, 154);
    doc.text(`Rs. ${basePrice.toFixed(2)}`, 72, 154);

    doc.text("Passenger Quantity:", 24, 161);
    doc.text(`x ${seats}`, 72, 161);

    doc.text("Reservation & IRCTC Surcharge:", 24, 168);
    doc.text("Rs. 0.00 (Waived)", 72, 168);

    // Total Paid Banner (Right side of fare box)
    doc.setFillColor(15, 30, 60);
    doc.roundedRect(118, 149, 68, 26, 2, 2, "F");
    doc.setTextColor(191, 219, 254);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("TOTAL FARE PAID", 124, 156);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, 124, 165);

    doc.setFontSize(7.5);
    doc.setTextColor(187, 247, 208);
    doc.text(isCancelled ? "REFUND INITIATED" : "PAYMENT CONFIRMED (ONLINE)", 124, 171);

    // Realistic Barcode simulation
    let bx = 22;
    const by = 184;
    const bh = 12;
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 50; i++) {
        const w = (i % 3 === 0 || i % 7 === 0) ? 0.9 : 0.45;
        doc.rect(bx, by, w, bh, "F");
        bx += w + (i % 2 === 0 ? 0.6 : 0.4);
    }

    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(`* ${pnr} - ${travelDate.replace(/-/g, "")} *`, 24, 201);

    // Verification Meta
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Verification ID: SEC-${String(reservationId).padStart(8, "0")}`, 118, 190);
    doc.text(`Issue Timestamp: ${new Date().toLocaleString()}`, 118, 196);

    // Instructions Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(254, 252, 232);
    doc.roundedRect(18, 207, 174, 52, 2, 2, "FD");

    doc.setTextColor(113, 63, 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("IMPORTANT TRAVEL GUIDELINES & PASSENGER ADVISORY", 24, 215);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(68, 64, 60);
    doc.text("1. Photo Identification: Primary passenger must carry an original government-issued photo ID (Aadhaar, Passport, DL, Voter ID).", 24, 222);
    doc.text("2. Station Arrival: Please arrive at the platform at least 20 minutes prior to scheduled train departure.", 24, 228);
    doc.text("3. Digital Ticket Validity: This downloaded PDF electronic ticket is legally valid on mobile screens without printing.", 24, 234);
    doc.text("4. Luggage Policy: Free allowance of personal luggage as per standard railway regulations applies.", 24, 240);
    doc.text("5. Cancellations & Modifications: Cancellations can be easily performed online through the RailEase portal under My Reservations.", 24, 246);
    doc.text("6. Support: For emergencies or assistance, dial Railway Helpline 139 or contact RailEase 24x7 customer desk.", 24, 252);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("RailEase Smart Ticket Management System • support@railease.com • Helpline: 1800-RAIL-EASE", 34, 274);

    return doc;
}

/**
 * Downloads the PDF directly to the user's system/browser.
 * @param {Object} ticket
 */
export function downloadTicketPDF(ticket) {
    const doc = generateTicketPDF(ticket);
    const reservationId = ticket.id || String(Date.now()).slice(-6);
    const pnr = ticket.pnr || `RL${String(reservationId).padStart(6, "0")}`;
    const safePassenger = (ticket.passenger_name || "Passenger")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .slice(0, 16);

    const filename = `RailEase_Ticket_${pnr}_${safePassenger}.pdf`;
    doc.save(filename);
    return filename;
}
