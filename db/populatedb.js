const { Client } = require("pg");

const SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR (100) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_name VARCHAR (100) NOT NULL UNIQUE,
    item_price INTEGER NOT NULL,
    category_id INTEGER REFERENCES categories ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS colors (
    color_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    color_name VARCHAR (50) NOT NULL,
    item_id INTEGER REFERENCES items
  );
`;

const connectionString = process.argv[2];

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

main();
