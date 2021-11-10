const { App, ExpressReceiver } = require("@slack/bolt");
const db = require("../models/index");
const Response = db.responses;

require("dotenv").config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});

app.command("/bot", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();
  console.log("Payload", payload);
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      blocks: [
        {
          type: "section",
          block_id: "section678",
          text: {
            type: "mrkdwn",
            text: "Welcome. How are you doing?",
          },
          accessory: {
            action_id: "opt_01",
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an option",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Doing Well",
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Neutral",
                },
                value: "value-1",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Feeling Lucky",
                },
                value: "value-2",
              },
            ],
          },
        },
      ],
      // Text in the notification
      text: "Message from Test App",
    });
  } catch (error) {
    console.error(error);
  }
});

app.action("opt_01", async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  let obj = {};
  obj.user = body.user;
  obj.response = body.actions[0].selected_option;
  storeResponse(obj);

  try {
    // Update the message
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      ts: body.message.ts,
      // Channel of message
      channel: body.channel.id,
      blocks: [
        {
          type: "section",
          block_id: "section678",
          text: {
            type: "mrkdwn",
            text: "What are your favorite hobbies",
          },
          accessory: {
            action_id: "opt_02",
            type: "multi_static_select",
            placeholder: {
              type: "plain_text",
              text: "Select items",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Football",
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Music",
                },
                value: "value-1",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Sleep",
                },
                value: "value-2",
              },
            ],
          },
        },
      ],
      text: "Message from Test App",
    });
  } catch (error) {
    console.error(error);
  }
});

app.action("opt_02", async ({ ack, body, context }) => {
  // Acknowledge the action request
  ack();

  let obj = {};
  obj.user = body.user;
  obj.response = body.actions[0].selected_options;
  storeResponse(obj);

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      ts: body.message.ts,
      // Channel of message
      channel: body.channel.id,
      blocks: [
        {
          type: "section",
          block_id: "section678",
          text: {
            type: "mrkdwn",
            text: "*Thank You!*",
          },
        },
      ],
    });
  } catch (error) {}
});

const storeResponse = (obj) => {
  console.log("Storing response!", obj);
  // create new data
  let response = new Response({
    user: obj.user,
    response: obj.response,
  });
  // Save data in DB
  response.save();
};

module.exports = { app, receiver };
