export async function json(request, response) {
  const bufs = [];

  for await (const chunk of request) {
    bufs.push(chunk);
  }

  try {
    request.body = JSON.parse(Buffer.concat(bufs).toString());
  } catch (error) {
    request.body = null;
  }

  response.setHeader("Content-type", "application/json");
}
