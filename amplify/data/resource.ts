import { a, type ClientSchema, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Vote: a
    .model({
      rank: a.integer().required(),
      choiceId: a.id().required(),
      choice: a.belongsTo("Choice", "choiceId"),
      roomId: a.id().required(),
      room: a.belongsTo("Room", "roomId"),
      ownerId: a.id().required(),
      owner: a.belongsTo("User", "ownerId"),
    })
    .identifier(["choiceId", "ownerId"])
    .authorization((allow) => [allow.authenticated()]),
  Choice: a
    .model({
      name: a.string().required(),
      description: a.string(),
      roomId: a.id().required(),
      room: a.belongsTo("Room", "roomId"),
      ownerId: a.id().required(),
      owner: a.belongsTo("User", "ownerId"),
      votes: a.hasMany("Vote", "choiceId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Room: a
    .model({
      name: a.string().required(),
      description: a.string(),
      slug: a.string().required(),
      status: a.enum(["private", "open", "results"]),
      ownerId: a.id().required(),
      owner: a.belongsTo("User", "ownerId"),
      choices: a.hasMany("Choice", "roomId"),
      votes: a.hasMany("Vote", "roomId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Result: a
    .model({
      points: a.integer().required(),
      choiceId: a.id().required(),
      choice: a.belongsTo("Choice", "choiceId"),
      roomId: a.id().required(),
      room: a.belongsTo("Room", "roomId"),
    })
    .identifier(["choiceId", "roomId"])
    .authorization((allow) => [allow.authenticated()]),

  RoomMember: a
    .model({
      owner: a.id().required(),
      user: a.belongsTo("User", "userId"),
      roomId: a.id().required(),
      room: a.belongsTo("Room", "roomId"),
      hasVoted: a.boolean().required(),
    })
    .identifier(["userId", "roomId"])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
