// // src/routes/emailRoutes.js

// import express from "express";
// import addEmailJob from "../producer/emailProducer.js";

// const router = express.Router();

// router.post("/send", async (req, res) => {
//   try {
//     const { to, subject, text } = req.body;

//     if (!to || !subject || !text) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     await addEmailJob({ to, subject, text });

//     res.json({ message: "Email queued successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to queue email" });
//   }
// });

// export default router;

// src/routes/emailRoutes.js (Updated)

import express from "express";
import addEmailJob from "../producer/emailProducer.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const jobsData = req.body; // Capture the raw request body data

    // Basic validation: Check if the body is empty
    if (!jobsData || (Array.isArray(jobsData) && jobsData.length === 0)) {
      return res
        .status(400)
        .json({ error: "Missing email job data in request body" });
    }

    // Pass the raw data (which can be a single object or an array)
    // to the producer function. Validation is handled by the producer now.
    await addEmailJob(jobsData);

    res.json({
      message: `Queued ${
        Array.isArray(jobsData) ? jobsData.length : 1
      } email(s) successfully`,
    });
  } catch (err) {
    console.error("Failed to queue email(s):", err);
    res.status(500).json({ error: "Failed to queue email(s)" });
  }
});

export default router;
