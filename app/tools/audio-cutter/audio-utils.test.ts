import test from "node:test";
import assert from "node:assert/strict";

import { clampRange, formatTime } from "./audio-utils.ts";

test("formatTime converts seconds into a readable mm:ss format", () => {
  assert.equal(formatTime(0), "0:00");
  assert.equal(formatTime(65), "1:05");
  assert.equal(formatTime(3721), "62:01");
});

test("clampRange keeps the current selection inside the available timeline", () => {
  assert.equal(clampRange(10, 0, 20), 10);
  assert.equal(clampRange(-2, 0, 20), 0);
  assert.equal(clampRange(25, 0, 20), 20);
  assert.equal(clampRange(8, 5, 12), 8);
});
