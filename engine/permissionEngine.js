const { Engine } = require("json-rules-engine");
const fs = require("fs");
const { count } = require("console");

const rules = JSON.parse(fs.readFileSync("./rules/permissions.json", "utf8"));

function createPermissionEngine() {
  const engine = new Engine();
  engine.addOperator("startsWith", (factValue, jsonValue) => {
    if (typeof factValue !== "string") return false;
    return factValue.startsWith(jsonValue);
  });
  engine.addFact("birthYear", async (params, almanac) => {
    const age = await almanac.factValue("age");
    const currentYear = new Date().getFullYear();
    return currentYear - age;
  });

  rules.forEach((rule) => engine.addRule(rule));
  return engine;
}

async function checkPermission(facts) {
  const engine = createPermissionEngine();
  engine.on("success", (event, almanac, ruleResult) => {
    console.log("✅ Rule matched:");
    console.log("  - Name:", ruleResult.name);
    console.log("  - Type:", event.type);
    console.log("  - Params:", event.params);
  });

  engine.on("failure", (event, almanac, ruleResult) => {
    console.log("❌ Rule failed:", ruleResult.name);
  });
  const { events } = await engine.run(facts);
  events.forEach((event) => {
    console.log("🔥 Rule triggered:", event.type);
    console.log("📦 Params:", event.params);
  });
  const isAllowed = events.some((event) => event.type === "access-granted");
  return isAllowed;
}

module.exports = { checkPermission };
