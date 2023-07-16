module.exports = grammar({
  name: 'json',
  rules: {
    source_file: $ => $.value,
    value: $ => choice(
      $.string,
      $.number,
      $.object,
      $.array,
      $.true,
      $.false,
      $.null
    ),
    object: $ => seq(
      '{',
      optional($.pair),
      repeat(seq(',', $.pair)),
      '}'
    ),
    pair: $ => seq(
      $.string,
      ':',
      $.value
    ),
    array: $ => seq(
      '[',
      optional($.value),
      repeat(seq(',', $.value)),
      ']'
    ),
    string: $ => seq(
      '"',
      repeat(choice(
        token.immediate(prec(1, /[^"\\\n]+/)),
        $.escape_sequence
      )),
      '"'
    ),
    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /["\\/bfnrt]/,
        /u[0-9a-fA-F]{4}/
      )
    )),
    number: $ => {
      const frac = seq('.', repeat1(/[0-9]/));
      const exp = seq(choice('e', 'E'), optional(choice('-', '+')), repeat1(/[0-9]/));
      return token(seq(
        optional('-'),
        choice(
          '0',
          seq(/[1-9]/, repeat(/[0-9]/))
        ),
        optional(frac),
        optional(exp)
      ))
    },
    true: $ => 'true',
    false: $ => 'false',
    null: $ => 'null',
  }
});
