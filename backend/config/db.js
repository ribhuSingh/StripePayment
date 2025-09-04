// src/config/db.js
import knex from "knex";
import knexConfig from "../knexfile.cjs";
import { NODE_ENV } from "./env.js";

const environment = NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export default db;
