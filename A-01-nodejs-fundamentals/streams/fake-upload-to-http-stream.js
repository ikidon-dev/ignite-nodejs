import { Readable } from "node:stream";

class FakeUploadToHttpStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));

        this.push(buf);
      }
    }, 1000);
  }
}

fetch("http://localhost:4010", {
  method: "POST",
  body: new FakeUploadToHttpStream(),
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    console.log(data);
  });
