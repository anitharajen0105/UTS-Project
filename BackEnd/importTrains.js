const fs = require('fs');
const xlsx = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importData() {
    try {
        const workbook = xlsx.readFile('./modified_train_dataset (1).xlsx'); // Update with your file path
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Loaded ${data.length} rows from the spreadsheet.`);

        for (const row of data) {
            console.log('Processing row:', row);

            const stationName = row['Station'];
            const trainNumber = row['Train number'];

            if (!stationName || !trainNumber) {
                console.error(`Missing required data in row: ${JSON.stringify(row)}`);
                continue; // Skip rows with missing station name or train number
            }

            // Convert the date from DD-MM-YYYY to YYYY-MM-DD
            const dateParts = row['Date'].split('-');
            const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); // YYYY-MM-DD

            // Convert the arrival time to a valid Date object
            const arrivalTimeParts = row['Arrival Time'].split(':');
            const formattedArrivalTime = new Date(formattedDate);
            formattedArrivalTime.setHours(arrivalTimeParts[0], arrivalTimeParts[1]);

            // Validate the dates
            if (isNaN(formattedDate.getTime()) || isNaN(formattedArrivalTime.getTime())) {
                console.error(`Invalid date for row: ${JSON.stringify(row)}`);
                continue; // Skip rows with invalid dates
            }

            // Check if the station already exists
            const station = await prisma.station.findUnique({
                where: {
                    name: stationName,
                },
            });

            let stationId;
            if (!station) {
                console.log(`Station not found. Creating new station: ${stationName}`);
                const newStation = await prisma.station.create({
                    data: { name: stationName },
                });
                stationId = newStation.id;
            } else {
                stationId = station.id;
            }

            // Check for existing train record
            const existingTrain = await prisma.train.findFirst({
                where: {
                    trainNumber: String(trainNumber),
                    stationId: stationId,
                    date: formattedDate, // Optionally include date
                },
            });

            if (existingTrain) {
                console.log(`Train ${trainNumber} at station ${stationName} on ${formattedDate} already exists.`);
                continue; // Skip if it already exists
            }

            // Create the train record in the database
            await prisma.train.create({
                data: {
                    trainNumber: String(trainNumber),
                    date: formattedDate,
                    arrivalTime: formattedArrivalTime,
                    coachGroup1: row['Coach Group 1'],
                    coachGroup2: row['Coach Group 2'],
                    coachGroup3: row['Coach Group 3'],
                    coachGroup4: row['Coach Group 4'],
                    target: row['Target'],
                    count: row['Count'],
                    station: {
                        connect: { id: stationId },
                    },
                    basePrice: row['Base Price'], // Added base price
                    adjustedPrice: row['Adjusted Price'], // Added adjusted price
                    gstTaxAmount: row['GST Tax Amount'], // Added GST tax amount
                    finalPrice: row['Final Price'], // Added final price
                    trainName: row['Train Name'], // Added train name
                },
            });
        }

        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Test database connection before importing
async function testConnection() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
        await importData();
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

// Start the process
testConnection();
