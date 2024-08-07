import { describe, it, expect, vi } from "vitest"
import { log } from "fishtvue/index"
describe("Testing lib", () => {
  it("log update title", () => {
    const logSpy = vi.spyOn(console, "log")
    log()
    expect(logSpy).toHaveBeenCalledWith("Work project hello")
    logSpy.mockRestore()
  })
  it("log add value!!!", () => {
    const logSpy = vi.spyOn(console, "log")
    log("test text")
    expect(logSpy).toHaveBeenCalledWith("test text")
    logSpy.mockRestore()
  })
})
