// src/consumer/emailConsumer.js

import { kafka } from "../config/kafka.js";
import { transporter } from "../config/mailer.js";
import cron from "node-cron";

// Create consumer instance
const consumer = kafka.consumer({ groupId: "email-group" });

// In-memory batch
let batch = [];

// Function to send a single email
async function sendSingleEmail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      from: "noreply@example.com",
      to,
      subject,
      text,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.log("Error sending email:", error.message);
  }
}

// START CONSUMER + RECEIVE JOBS
async function startConsumer() {
  await consumer.connect();
  console.log("Consumer connected");

  await consumer.subscribe({ topic: "email-jobs" });
  console.log("Subscribed to topic: email-jobs");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("Received job:", data);

      batch.push(data); // Add job to batch
    },
  });
}

// BATCH SCHEDULER – runs every 1 minute
cron.schedule("* * * * *", async () => {
  if (batch.length === 0) {
    console.log("Batch empty — nothing to send.");
    return;
  }

  console.log(`Processing batch of ${batch.length} emails...`);

  for (let job of batch) {
    await sendSingleEmail(job);
  }

  batch = []; // clear batch after sending

  console.log("Batch processing done.");
});

export default startConsumer;
