import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  hasSafeBrowserOrigin,
  isBoundedString,
  isUuid,
  requestBodyIsTooLarge,
} from "../lib/request-security";

const sameOrigin = new NextRequest("https://blog.addiscrown.et/api/admin/recommendations", {
  method: "POST",
  headers: { origin: "https://blog.addiscrown.et", "content-length": "20" },
});
assert.equal(hasSafeBrowserOrigin(sameOrigin), true);
assert.equal(requestBodyIsTooLarge(sameOrigin), false);

const crossOrigin = new NextRequest("https://blog.addiscrown.et/api/admin/recommendations", {
  method: "POST",
  headers: { origin: "https://evil.example" },
});
assert.equal(hasSafeBrowserOrigin(crossOrigin), false);

const oversized = new NextRequest("https://blog.addiscrown.et/api/admin/recommendations", {
  method: "POST",
  headers: { "content-length": "1000001" },
});
assert.equal(requestBodyIsTooLarge(oversized), true);

assert.equal(isBoundedString("valid", 5), true);
assert.equal(isBoundedString("", 5), false);
assert.equal(isBoundedString("too long", 5), false);
assert.equal(isUuid("00000000-0000-4000-8000-000000000000"), true);
assert.equal(isUuid("not-a-uuid"), false);

console.log("request-security tests passed");
