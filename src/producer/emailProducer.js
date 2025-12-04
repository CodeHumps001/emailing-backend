// // src/producer/emailProducer.js

// import { kafka } from "../config/kafka.js";

// const producer = kafka.producer();

// async function addEmailJob(data) {
//   await producer.connect();

//   await producer.send({
//     topic: "email-jobs",
//     messages: [{ value: JSON.stringify(data) }],
//   });

//   console.log("Job added to Kafka queue:", data);

//   await producer.disconnect();
// }

// export default addEmailJob;

// src/producer/emailProducer.js (Updated for bulk sends)

import { kafka } from "../config/kafka.js";

const producer = kafka.producer();

async function addEmailJob(jobsData) {
  await producer.connect();

  let messages = [];

  // Check if jobsData is an array to handle bulk inputs efficiently
  if (Array.isArray(jobsData)) {
    // If it's an array, map each job object to the required Kafka message format
    messages = jobsData.map((job) => ({
      value: JSON.stringify(job),
    }));
  } else {
    // If it's a single object, format it as a single message within the array
    messages.push({
      value: JSON.stringify(jobsData),
    });
  }

  // Send all messages in a single batch call to Kafka
  await producer.send({
    topic: "email-jobs",
    messages: messages,
  });

  console.log(`Added ${messages.length} job(s) to Kafka queue.`);

  await producer.disconnect();
}

export default addEmailJob;
