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

// src/routes/habits.ts
var habits_exports = {};
__export(habits_exports, {
  habitsRoutes: () => habitsRoutes
});
module.exports = __toCommonJS(habits_exports);
var import_zod2 = require("zod");

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

// src/routes/habits.ts
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
async function habitsRoutes(app) {
  app.get("/habits", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const { sessionID } = req.cookies;
    const habits = await db("habits").select("*");
    return { habits };
  });
  app.get("/habits/:habitId", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const getHabitParamsSchema = import_zod2.z.object({
      habitId: import_zod2.z.string().uuid()
    });
    const { habitId } = getHabitParamsSchema.parse(req.params);
    const { sessionID } = req.cookies;
    const habit = await db("habits").select("*").where("habitId", habitId).first();
    return habit;
  });
  app.post("/habits", {
    preHandler: [checkSessionIdExists]
  }, async (req, res) => {
    const createHabitsBodySchema = import_zod2.z.object({
      habit: import_zod2.z.string(),
      category: import_zod2.z.string()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  habitsRoutes
});
