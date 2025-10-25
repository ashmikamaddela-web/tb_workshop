const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json()); // parse JSON bodies

const PORT = 3000;

// ---------------------------
// Helper function to read/write database
// ---------------------------
function readDatabase() {
  return JSON.parse(fs.readFileSync("database.json", "utf8"));
}

function writeDatabase(data) {
  fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
}

// ---------------------------
// POST /passes - student requests a pass
// ---------------------------
app.post("/passes", (req, res) => {
  const { studentName, studentId, reason, outTime } = req.body;
  if (!studentName || !studentId || !reason) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const data = readDatabase();
  const newPass = {
    id: data.length + 1,
    studentName,
    studentId,
    reason,
    outTime: outTime || "",
    status: "pending",
    remark: ""
  };
  data.push(newPass);
  writeDatabase(data);

  res.json(newPass);
});

// ---------------------------
// GET /passes - get all passes (for moderator)
// ---------------------------
app.get("/passes", (req, res) => {
  const data = readDatabase();
  res.json(data);
});

// ---------------------------
// PATCH /passes/:id - moderator approves/rejects
// ---------------------------
app.patch("/passes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { status, remark } = req.body;
  const data = readDatabase();
  const pass = data.find(p => p.id === id);

  if (pass) {
    pass.status = status;
    pass.remark = remark || "";
    writeDatabase(data);
    res.json({ message: "Pass updated", pass });
  } else {
    res.status(404).json({ message: "Pass not found" });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));