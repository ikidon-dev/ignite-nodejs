import http from "node:http";
import { Transform } from "node:stream";

// request => ReadableStream
// request => WritableStream

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    console.log(transformed);

    callback(null, Buffer.from(String(transformed)));
  }
}

// // consuming a stream
// const server = http.createServer(async (request, response) => {
//   return request.pipe(new InverseNumberStream()).pipe(response);
// });

// completely consuming a stream
const server = http.createServer(async (request, response) => {
  const bufs = [];

  for await (const chunk of request) {
    bufs.push(chunk);
  }

  const fullStreamContent = Buffer.concat(bufs).toString();

  console.log(fullStreamContent);

  return response.end(fullStreamContent);
});

server.listen(4010);
