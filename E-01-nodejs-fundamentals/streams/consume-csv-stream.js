import { parse } from "csv-parse";
import fs from "node:fs";

const path = new URL("./tasks.csv", import.meta.url);

const fsReadableStream = fs.createReadStream(path);

async function consumeCsvStream() {
  fsReadableStream.pipe(
    parse(
      { skipEmptyLines: true, columns: true, delimiter: "," },
      async (error, records) => {
        try {
          if (error) {
            throw new Error(error.message);
          }

          // só enfeite kk
          let numberOfRecordsSent = 0;
          let totalNumberOfRecords = Array.from(records).length;

          for await (const record of records) {
            await fetch("http://localhost:4000/tasks", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(record),
            });

            let percentageOfSubmittedRecords = `${
              (numberOfRecordsSent * 100) / totalNumberOfRecords
            }%`;

            numberOfRecordsSent++;

            console.clear();
            console.log(`Upload: ${percentageOfSubmittedRecords}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.log({ message: error.message });
          return;
        }
      }
    )
  );
}

consumeCsvStream();
