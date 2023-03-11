import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      try {
        const { title, description } = request.query;
        const filter = {};

        if (title) {
          filter.title = title;
        }
        if (description) {
          filter.description = description;
        }

        const isEmpty = Object.keys(filter).length <= 0;

        const tasks = database.select("tasks", isEmpty ? null : filter);

        return response.end(JSON.stringify(tasks));
      } catch (error) {
        return response
          .writeHead(400)
          .end(JSON.stringify({ message: error.message }));
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (request, response) => {
      try {
        const { title, description } = request.body;

        if (!title || !description) {
          throw new Error("Title and description are required");
        }

        database.insert("tasks", {
          title,
          description,
          completedAt: null,
        });

        return response.writeHead(201).end();
      } catch (error) {
        return response
          .writeHead(400)
          .end(JSON.stringify({ message: error.message }));
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      try {
        const { id } = request.params;
        const { title, description } = request.body;
        const willChange = { completedAt: null };

        if (title) {
          willChange.title = title;
        }

        if (description) {
          willChange.description = description;
        }

        database.update("tasks", id, willChange);

        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: error.message }));
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (request, response) => {
      try {
        const { id } = request.params;

        const task = database.select("tasks", { id })[0];

        console.log(task);

        database.update("tasks", id, {
          completedAt: !task.completedAt ? new Date() : null,
        });

        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: error.message }));
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (request, response) => {
      try {
        const { id } = request.params;

        database.delete("tasks", id);

        return response.writeHead(204).end();
      } catch (error) {
        return response
          .writeHead(404)
          .end(JSON.stringify({ message: error.message }));
      }
    },
  },
];
