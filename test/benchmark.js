const Benchmark = require("benchmark");
const bcrypt = require("bcryptjs");

const password = "my_secure_password";
const saltRounds = 10;

const suite = new Benchmark.Suite();

suite.add("bcrypt.hash", async function (deferred) {
    await bcrypt.hash(password, saltRounds);
    deferred.resolve();
}, { defer: true });

suite.add("bcrypt.compare", async function (deferred) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await bcrypt.compare(password, hashedPassword);
    deferred.resolve();
}, { defer: true });

suite
    .on("cycle", function (event) {
        console.log(String(event.target));
    })
    .on("complete", function () {
        console.log("Fastest method is: " + this.filter("fastest").map("name"));
    })
    .run({ async: true });
