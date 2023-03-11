import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((response) => (this.#database = JSON.parse(response)))
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, filter) {
    let data = this.#database[table] ?? [];

    if (filter) {
      data = data.filter((row) => {
        return Object.entries(filter).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push({
        ...data,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      this.#database[table] = [
        {
          ...data,
          id: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      throw new Error(`Could not find a record with that ID: ${id}`);
    }

    const prev = this.#database[table][rowIndex];
    this.#database[table][rowIndex] = {
      ...prev,
      ...data,
      updatedAt: new Date(),
    };
    this.#persist();
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex === -1) {
      throw new Error(`Could not find a record with that ID: ${id}`);
    }

    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }
}
