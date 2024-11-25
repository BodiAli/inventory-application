const { Client } = require("pg");

const SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR (100) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS items (
    item_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_name VARCHAR (100) NOT NULL UNIQUE,
    item_description TEXT NOT NULL,
    item_price INTEGER NOT NULL,
    category_id INTEGER REFERENCES categories ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS colors (
    color_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    color_name VARCHAR (50) NOT NULL,
    item_id INTEGER REFERENCES items
  );

  INSERT INTO categories (category_name) VALUES
   ('Smart Phones'), 
   ('Laptops'), 
   ('Smart Watches');

  INSERT INTO items (item_name, item_description, item_price, category_id) VALUES
   (
    'iPhone 12',
    'The iPhone 12 is a sleek and powerful smartphone from Apple, featuring a 6.1-inch Super Retina XDR display for stunning visuals and a Ceramic Shield front for enhanced durability.',
    '279',
    '1'
  ), 
  (
    'Samsung Galaxy S21',
    'The Samsung Galaxy S21 is a flagship Android smartphone featuring a 6.2-inch Dynamic AMOLED 2X display with a smooth 120Hz refresh rate for vibrant visuals.',
    '350',
    '1'
  ), 
  (
    'Google Pixel 7',
    'The Google Pixel 7 is a premium smartphone designed for photography lovers and seamless Android experiences. It features a 6.3-inch OLED display with sharp, vivid colors and a smooth 90Hz refresh rate.',
    '244',
    '1'
  ),
  (
    'MacBook Air (M2)',
    'A lightweight, ultra-thin laptop with the powerful Apple M2 chip, offering exceptional performance and long battery life—perfect for work and travel.',
    '999',
    '2'
  ),
  (
    'Dell XPS 13',
    'A premium laptop with a stunning 13.4-inch InfinityEdge display, powerful Intel processors, and sleek design for productivity on the go.',
    '1299',
    '2'
  ),
  (
    'HP Spectre x360',
    'A versatile 2-in-1 laptop with a touch-enabled display, premium build quality, and excellent performance for creative professionals and multitaskers.',
    '1449',
    '2'
  ),
  (
    'Apple Watch Series 8',
    'A feature-rich smartwatch with advanced health tracking, fitness features, and seamless integration with Apple devices.',
    '344',
    '3'
  ),
  (
    'Samsung Galaxy Watch 6',
    'A stylish and powerful smartwatch with a vibrant display, long battery life, and comprehensive fitness and wellness tracking.',
    '205',
    '3'
  ),
  (
    'Garmin Venu 2',
    'A rugged smartwatch designed for fitness enthusiasts, offering detailed activity tracking, GPS, and durable build quality.',
    '259',
    '3'
  );


  INSERT INTO colors (color_name, item_id) VALUES ('black', '1');
  
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
