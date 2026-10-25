import { describe, it, expect, vi, beforeEach } from "vitest";

const load = async (value: string) => {
  vi.resetModules();
  vi.stubEnv("VITE_BUGS", value);
  return import("@/bugs");
};

describe("seeded bug switchboard", () => {
  beforeEach(() => vi.unstubAllEnvs());

  it("has no bugs active when VITE_BUGS is none or empty", async () => {
    for (const v of ["none", "", "NONE"]) {
      const { isBug, BUG_IDS } = await load(v);
      expect(BUG_IDS.some((id) => isBug(id))).toBe(false);
    }
  });

  it("activates every bug with 'all'", async () => {
    const { isBug, BUG_IDS } = await load("all");
    expect(BUG_IDS).toHaveLength(20);
    expect(BUG_IDS.every((id) => isBug(id))).toBe(true);
  });

  it("activates only the listed bugs, ignoring case and spaces", async () => {
    const { isBug } = await load("b01, B04 ,b17");
    expect(isBug("B01") && isBug("B04") && isBug("B17")).toBe(true);
    expect(isBug("B02")).toBe(false);
  });
});
