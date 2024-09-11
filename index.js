// Import the necessary modules
const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL:
    "https://minetest-16ba8-default-rtdb.asia-southeast1.firebasedatabase.app", // Replace with your database URL
});

// Get a reference to the database service
const db = admin.database();

// Function to retrieve data from a given path
function retrieveData(path) {
  const ref = db.ref(path);

  return new Promise((resolve, reject) => {
    ref.once(
      "value",
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      (errorObject) => {
        reject(errorObject);
      }
    );
  });
}

// Function to display data in the console (for example usage)
async function displayData(path) {
  try {
    const data = await retrieveData(path);
    console.log(`Retrieved data from ${path}:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error retrieving data:", error.message);
  }
}

// Express route to retrieve data from Firebase
app.get("/data/:path", async (req, res) => {
  const path = req.params.path; // Get the path from the request parameters
  try {
    const data = await retrieveData(path);
    res.status(200).json({ data: data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving data", details: error.message });
  }
});

// Express route to write data to Firebase
app.post("/profiles/:profileId", (req, res) => {
  const profileId = req.params.profileId; // The specific ID for the profile
  const profileData = req.body;

  const ref = db.ref(`mines/Profiles`);

  // Update the specific profile data or add it if it doesn't exist
  ref.update({ [profileId]: profileData }, (error) => {
    if (error) {
      console.error("Data could not be saved: ", error);
      res.status(500).send("Data could not be saved.");
    } else {
      console.log("Data saved successfully.");
      res.status(200).send("Data saved successfully.");
    }
  });
});

app.post("/mainlogs/:logid", (req, res) => {
  const logid = req.params.Logid; // The specific date for the attendance
  const logData = req.body;

  const logRef = db.ref(`mines/MainLogs`);

  // Update the specific attendance data or add it if it doesn't existcurl -Method Get -Uri http://localhost:3000/data/your/path/here

  logRef.update(logData, (error) => {
    if (error) {
      console.error("Log data could not be saved: ", error);
      res.status(500).send("Log data could not be saved.");
    } else {
      console.log("Log data saved successfully.");
      res.status(200).send("Log data saved successfully.");
    }
  });
});

app.post("/attendance/:date/:workerId", (req, res) => {
  const date = req.params.date; // The specific date for the attendance
  const workerId = req.params.workerId; // The specific worker ID
  const attendanceData = req.body;

  const attendanceRef = db.ref(`mines/attendance`);

  // Update the specific attendance data or add it if it doesn't existcurl -Method Get -Uri http://localhost:3000/data/your/path/here

  attendanceRef.update(attendanceData, (error) => {
    if (error) {
      console.error("Attendance data could not be saved: ", error);
      res.status(500).send("Attendance data could not be saved.");
    } else {
      console.log("Attendance data saved successfully.");
      res.status(200).send("Attendance data saved successfully.");
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
