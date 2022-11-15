import { LazyParser, Parser, ParserType } from '@/types'
import { run, success } from '@/utils'

type Inner<T extends LazyParser<any>[]> = {
  [I in keyof T]: ParserType<T[I]>
}

/*
 * Creates a parser that will match when all of its parsers matches in sequence
 */
export function seq<T extends LazyParser<any>[]>(...parsers: T): Parser<Inner<T>> {
  return (ctx) => {
    const value = [] as any[]
    let next = ctx
    for (const parser of parsers) {
      const result = run(parser, next)
      if (result.success) {
        value.push(result.value)
        next = result.next
      } else {
        return result
      }
    }
    return success(value as Inner<T>, [ctx.offset, next.offset], next)
  }
}

/*
 * Creates a parser that will try to match the same parser repeated times
 */
export function many<T>(parser: LazyParser<T>, min: number, max: number): Parser<T[]> {
  return (ctx) => {
    const value = [] as T[]
    let next = ctx
    for (let i = 0; i < max; i++) {
      const result = run(parser, next)
      if (result.success) {
        value.push(result.value)
        next = result.next
      } else if (value.length < min) {
        return result
      } else {
        break
      }
    }
    return success(value, [ctx.offset, next.offset], next)
  }
}

/*
 * Creates a parser that will try to match the same parser zero or more number of times
 */
export function many0<T>(parser: LazyParser<T>): Parser<T[]> {
  return many(parser, 0, Number.POSITIVE_INFINITY)
}

/*
 * Creates a parser that will try to match the same parser one or more number of times
 */
export function many1<T>(parser: LazyParser<T>): Parser<T[]> {
  return many(parser, 1, Number.POSITIVE_INFINITY)
}
