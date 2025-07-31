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

// src/routes/users.ts
var users_exports = {};
__export(users_exports, {
  usersRoutes: () => usersRoutes
});
module.exports = __toCommonJS(users_exports);

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
async function usersRoutes(app) {
  app.get("/users", async () => {
    const users = await db("users").select("*");
    return { users };
  });
  app.get("/users/:userId", async (req, res) => {
    const getUserParamsSchema = import_zod2.default.object({
      userId: import_zod2.default.string().uuid().nullish()
    });
    const { userId } = getUserParamsSchema.parse(req.params);
    const user = await db("users").where("userId", userId).first();
    return { user };
  });
  app.post("/users", async (req, res) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usersRoutes
});
