import { describe, it } from "bun:test"

import { str } from "@/parsers"
import { assertParser } from "@/utils/testing"

import { named } from "./named"

describe("named", () => {
    const parser = named("Named Test", str("foo"))

    it("succeeds when the orignal parser succeeds", () => {
        assertParser(parser, "foo bar").succeeds(3, "foo")
    })

    it("assign the name to expected when the orignal parser succeeds", () => {
        assertParser(parser, "foo bar", { offset: 4 }).fails(0, ["Named Test"])
    })
})
