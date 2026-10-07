import assert from "node:assert/strict";
import test from "node:test";
import { pagesBase } from "../src/pages-base.ts";

test("local builds use relative asset URLs", () =>
  assert.equal(pagesBase(), "./"));
test("project Pages builds derive the case-sensitive repository name", () =>
  assert.equal(pagesBase(undefined, "marcusctookes22/NOVA"), "/NOVA/"));
test("configure-pages output controls project and custom-domain base paths", () => {
  assert.equal(pagesBase("/NOVA/", "owner/other"), "/NOVA/");
  assert.equal(pagesBase("", "marcusctookes22/NOVA"), "/");
  assert.equal(pagesBase("/"), "/");
});
test("user Pages repos work at the root and leading/trailing slashes normalize", () => {
  assert.equal(pagesBase(undefined, "owner/owner.github.io"), "./");
  assert.equal(pagesBase("///NOVA///"), "/NOVA/");
});
