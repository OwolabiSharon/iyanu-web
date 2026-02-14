// import { Queue, Worker, Job } from "bullmq";
// import { AppDataSource } from "@database/data-source";
// import { User } from "@database/entity/User";
// import { UserEmailConfig } from "@database/entity/UserEmailConfig";
// import EmailAgentService from "@services/agent/emailAgentService";
// import redis from "@config/redis";
// import {listCalendarEvents} from "@services/note-taker/utils";
// import dayjs from 'dayjs';
// import { NoteTaker } from "@services/note-taker";
// import { MeetingResult } from "@services/note-taker/interfaces";

// export async function processAllUsersUnreadEmails() {
//   try {
//     console.log("🔄 Starting to process unread emails for all users...");

//     // Get all users with their email configs using query builder
//     const usersWithConfigs = await AppDataSource
//       .createQueryBuilder(User, "user")
//       .leftJoinAndSelect("user.email_config", "email_config")
//       .where("email_config.id IS NOT NULL")
//       .andWhere("email_config.is_active = :isActive", { isActive: true })
//       .getMany();

//     console.log(`📊 Found ${usersWithConfigs.length} users with active email configurations`);

//     // Process each user's emails
//     for (const user of usersWithConfigs) {
//       try {
//         if (!user.email_config) {
//           console.log(`⚠️ User ${user.id} has no email config, skipping...`);
//           continue;
//         }

//         console.log(`📧 Processing emails for user ${user.id} (${user.email})`);

//         // Create email agent service with user's config
//         const emailAgent = new EmailAgentService({
//           email: user.email_config.email,
//           appPassword: user.email_config.app_password,
//           imapHost: user.email_config.imap_host,
//           imapPort: user.email_config.imap_port,
//           smtpHost: user.email_config.smtp_host,
//           smtpPort: user.email_config.smtp_port,
//           smtpSecure: user.email_config.smtp_secure,
//           user_id: user.id
//         });

//         // Process unread emails
//         await emailAgent.checkUnreadEmails();
//         console.log(`✅ Finished processing emails for user ${user.id}`);

//       } catch (userError) {
//         console.error(`❌ Error processing emails for user ${user.id}:`, userError);
//         // Continue with next user even if one fails
//         continue;
//       }
//     }

//     console.log("✅ Finished processing all users' unread emails");
//     return true;

//   } catch (error) {
//     console.error("❌ Error in processAllUsersUnreadEmails:", error);
//     throw error;
//   }
// }

// // Add a new queue for email processing
// export const emailProcessingQueue = new Queue("email-processing", { connection: redis });

// // Add a worker to handle email processing
// export const emailProcessingWorker = new Worker(
//   "email-processing",
//   async (job: Job) => {
//     console.log(`🔄 Processing job ${job.id} of type ${job.name}`);
    
//     if (job.name === "process-all-unread-emails") {
//       await processAllUsersUnreadEmails();
//     }
    
//     return { success: true };
//   },
//   { connection: redis }
// );

// // Add error handling for the worker
// emailProcessingWorker.on("error", (error) => {
//   console.error("❌ Email processing worker error:", error);
// });

// emailProcessingWorker.on("failed", (job, error) => {
//   console.error(`❌ Job ${job?.id} failed:`, error);
// });

// // Add a function to schedule the email processing
// export async function scheduleEmailProcessing() {
//   // Add a recurring job to process all users' unread emails every 5 minutes
//   const existingJobs = await emailProcessingQueue.getJobs(["active", "waiting", "delayed", "completed"]);
//   if(!existingJobs.length){
//     await emailProcessingQueue.add(
//       "process-all-unread-emails",
//       {},
//       {
//         repeat: {
//           every: 1 * 60 * 1000, // 5 minutes in milliseconds
//         },
//       }
//     );
//     console.log("✅ Scheduled email processing job");
//   }
// }

// export const calendarEventQueue = new Queue("calendar-event-check", { connection: redis });

// export const calendarEventWorker = new Worker(
//   "calendar-event-check",
//   async (job: Job) => {
//     console.log(`🔄 Checking for calendar events about to start...`);
//     try {
//       // Get all users (or filter as needed)
//       const users = await AppDataSource.getRepository(User).find();
//       for (const user of users) {
//         try {
//           // List calendar events (implement this method in your service)
//           const events = await listCalendarEvents("<GOOGLE_OAUTH_TOKEN>");
//           const now = dayjs();
//           for (const event of events!) {
//             // Assume event.startTime is a Date or ISO string
//             const start = dayjs(event!.start!.dateTime);
//             const diff = start.diff(now, 'minute');
//             console.log(diff)
//             if (diff <= 5) {
//               // Event starts in 1 minute
//               console.log(`⏰ Event '${event.summary}' for user ${user.id} starts in 1 minute!`);
//               const client = new NoteTaker({
//                 debug: false, // debug mode to show the browser
//                 name: "Sharon's agent", // Bot name
//                 googleMeetUrl: event!.hangoutLink || event!.location || "https://meet.google.com/txa-nghv-ffq",
//                 language: "en-US",
//                 geminiApiKey: "<GEMINI_API_KEY>", 
//                 recordMeeting: false,
//                 prompt: 'You are an Assistant Note Taker, based on the meeting results in the form of the transcript below, please make a summary of the meeting\n', // Optional, this is the default prompt that will be used to generate the summary
//                 user_id: 3
//               });
            
//                 // Start join the meeting
//               client.listen();
            
//               client.on("end", (result: MeetingResult) => {
//                 console.log("Summary:");
//                 console.log(result.summary);
            
//                 // exit process when done
//                 process.exit(0);
//               });
//               // You can add notification logic here
//             }
//           }
//         } catch (userError) {
//           console.error(`❌ Error checking events for user ${user.id}:`, userError);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error in calendar event check:", error);
//     }
//     return { success: true };
//   },
//   { connection: redis }
// );

// export async function scheduleCalendarEventCheck() {
//   // Run every minute
//   await calendarEventQueue.add(
//     "calendar-event-check-job",
//     {},
//     {
//       repeat: {
//         every: 60 * 1000, // 1 minute
//       },
//       jobId: "calendar-event-check-job"
//     }
//   );
//   console.log("✅ Scheduled calendar event check job");
// }
