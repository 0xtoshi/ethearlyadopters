import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
export const runtime = "nodejs";

// Let's initialize it as null initially, and we will assign the actual database instance later.
let db = null;

export default async function handler(req, res) {
  const address = req.query.eoa;
  if (validateInputAddresses(address) == true) {
    try {
      if (!db) {
        // If the database instance is not initialized, open the database connection
        db = await open({
          filename: path.resolve("eth.db"), // Specify the database file path
          driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
        });
      }

      const item = await db.get(
        "SELECT * FROM early WHERE address = ?",
        address.toLowerCase()
      );

      if (item !== undefined) {
        res.status(200).json({ status: 200, data: item });
      } else {
        res.status(200).json({ status: 404, data: "Not Eligible" });
      }

      // => {name: "Albania", code: "AL"}
    } catch (err) {
      res.status(404).json({ status: 404, data: err });
      console.log(err);
      //throw { status: "error", message: "Error Fetching RPC" };
    }
  } else {
    res.status(400).json({ status: 400, message: "Invalid Address" });
    //throw { status: "error", message: "Invalid Ip Address" };
  }
}

function validateInputAddresses(address) {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
}
