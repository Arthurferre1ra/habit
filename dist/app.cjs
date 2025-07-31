"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"), 1);
var import_cookie = __toESM(require("@fastify/cookie"), 1);

// src/habits-database.ts
var import_knex = __toESM(require("knex"), 1);

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/habits-database.ts
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  migrations: {
    extension: "ts",
    directory: "./database/migrations"
  },
  useNullAsDefault: true
};
var db = (0, import_knex.default)(config2);

// src/routes/users.ts
var import_zod2 = __toESM(require("zod"), 1);
var import_crypto = require("crypto");
async function usersRoutes(app2) {
  app2.get("/users", async () => {
    const users = await db("users").select("*");
    return { users };
  });
  app2.get("/users/:userId", async (req, res) => {
    const getUserParamsSchema = import_zod2.default.object({
      userId: import_zod2.default.string().uuid().nullish()
    });
    const { userId } = getUserParamsSchema.parse(req.params);
    const user = await db("users").where("userId", userId).first();
    return { user };
  });
  app2.post("/users", async (req, res) => {
    const createUsersBodySchema = import_zod2.default.object({
      userName: import_zod2.default.string(),
      document: import_zod2.default.string(),
      email: import_zod2.default.string()
    });
    const { userName, document, email } = createUsersBodySchema.parse(req.body);
    await db("users").insert({
      userId: (0, import_crypto.randomUUID)(),
      userName,
      document,
      email
    });
    return res.status(201).send("Usu\xE1rio criado com sucesso.");
  });
}

// src/routes/habits.ts
var import_zod3 = require("zod");
var import_node_crypto = require("crypto");

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request, response) {
  const { sessionID } = request.cookies;
  if (!sessionID) {
    return response.status(401).send({
      error: "Unauthorized."
    });
  }
}

// src/routes/habits.ts
async function habitsRoutes(app2) {
  app2.get("/habits", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const { sessionID } = req.cookies;
    const habits = await db("habits").select("*");
    return { habits };
  });
  app2.get("/habits/:habitId", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const getHabitParamsSchema = import_zod3.z.object({
      habitId: import_zod3.z.string().uuid()
    });
    const { habitId } = getHabitParamsSchema.parse(req.params);
    const { sessionID } = req.cookies;
    const habit = await db("habits").select("*").where("habitId", habitId).first();
    return habit;
  });
  app2.post("/habits", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const createHabitsBodySchema = import_zod3.z.object({
      habit: import_zod3.z.string(),
      category: import_zod3.z.string()
    });
    const { habit, category } = createHabitsBodySchema.parse(req.body);
    let sessionID = req.cookies.sessionID;
    if (!sessionID) {
      sessionID = (0, import_node_crypto.randomUUID)();
      res.cookie("sessionID", sessionID, {
        path: "/",
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 7 Dias
      });
    }
    await db("habits").insert({
      habitId: (0, import_node_crypto.randomUUID)(),
      habit,
      category,
      sessionId: sessionID
    }).returning("*");
    return res.status(201).send("Novo poss\xEDvel h\xE1bito registrado. Fa\xE7a valer!");
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(usersRoutes);
app.register(habitsRoutes);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
