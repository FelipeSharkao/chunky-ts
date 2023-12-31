import { describe, it } from "bun:test"

import { str } from "@/parsers"
import { assertParser } from "@/utils/testing"

import { not, oneOf, optional, predicate } from "./choice"

describe("optional", () => {
    const parser = optional(str("bana"))

    it("results null instead of failing", () => {
        const src = "banana"
        assertParser(parser, src, { offset: 0 }).succeeds(4, "bana")
        assertParser(parser, src, { offset: 2 }).succeeds(0, null)
    })
})

describe("predicate", () => {
    it("matches without moving the context", () => {
        const parser = predicate(str("bana"))
        const src = "banana"
        assertParser(parser, src, { offset: 0 }).succeeds(0, "bana")
    })

    it("fails when the original parser fails", () => {
        const parser = predicate(str("bana"))
        const src = "banana"
        assertParser(parser, src, { offset: 2 }).fails(0, ['"bana"'])
    })
})

describe("not", () => {
    const parser = not(str("bana"))

    it("fails when the original parser succeede", () => {
        const src = "banana"
        assertParser(parser, src, { offset: 0 }).fails()
    })

    it("succeede when the original parser fails", () => {
        const src = "banana"
        assertParser(parser, src, { offset: 2 }).succeeds(0, null)
    })
})

describe("oneOf", () => {
    const parser = oneOf(str("bana"), str("nana"))

    it("matches when any of parsers matches", () => {
        const src = "banana"
        assertParser(parser, src, { offset: 0 }).succeeds(4, "bana")
        assertParser(parser, src, { offset: 2 }).succeeds(4, "nana")
    })

    it("fails when all of the original parser fails", () => {
        const src = "banana"
        assertParser(parser, src, { offset: 4 }).fails(0, ['"bana"', '"nana"'])
    })

    it("matches the first parser that matches in ambigous cases", () => {
        const parser = oneOf(str("an"), str("anan"))
        const src = "banana"
        assertParser(parser, src, { offset: 1 }).succeeds(2, "an")
    })
})
