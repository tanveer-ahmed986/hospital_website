const fs = require("fs");
const content = require("./doctor-profile-content.js");
fs.writeFileSync("src/app/doctors/[id]/page.tsx", content, "utf8");
console.log("Success");
