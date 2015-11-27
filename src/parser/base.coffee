utils = require '../utils'

exports.entity = utils.entity
exports.debug = utils.debug
exports.warn = utils.warn
exports.str = str = utils.str
exports.convertIdentifier = utils.convertIdentifier
exports.isArray = utils.isArray
exports.extend = utils.extend
exports.wrapInfo1 = utils.wrapInfo1
exports.wrapInfo2 = utils.wrapInfo2
exports.charset = charset = utils.charset

exports.digits = digits = '0123456789'
exports.lowers = lowers = 'abcdefghijklmnopqrstuvwxyz'
exports.uppers = uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
exports.letters = letters = lowers+uppers
exports.letterDigits = letterDigits = letters+digits
exports.letterDigitSet = charset letterDigits
exports.firstIdentifierChars = firstIdentifierChars = '$_'+letters
exports.identifierChars = identifierChars = firstIdentifierChars+digits
exports.taijiIdentifierChars = taijiIdentifierChars = '!?'+identifierChars
exports.digitCharSet = digitCharSet = charset(exports.digits)
exports.letterCharSet = letterCharSet = charset(exports.letters)
exports.firstIdentifierCharSet = charset('$_'+letters)
exports.identifierCharSet = identifierCharSet = charset(identifierChars)
exports.taijiIdentifierCharSet = taijiIdentifierCharSet = charset(taijiIdentifierChars)
exports.taijiIdentifierCharSet = taijiIdentifierCharSet = charset(taijiIdentifierChars)

NUMBER=1;  STRING=2;  IDENTIFIER=3; SYMBOL=4; REGEXP=5;  HEAD_SPACES=6; CONCAT_LINE=7; PUNCT=8; FUNCTION=9
BRACKET=10; PAREN=11; DATA_BRACKET=12; CURVE=13; INDENT_EXPRESSION=14
NEWLINE=15;  SPACES=16; INLINE_COMMENT=17; SPACES_INLINE_COMMENT=18; LINE_COMMENT=19; BLOCK_COMMENT=20; CODE_BLOCK_COMMENT=21; CONCAT_LINE=22
MODULE_HEADER=23; MODULE=24
NON_INTERPOLATE_STRING=25; INTERPOLATE_STRING=26
INDENT=27; UNDENT=28; HALF_DENT=29; EOI=30; C_BLOCK_COMMENT = 31; SPACE_COMMENT = 32; TAIL_COMMENT=33
#PAREN_OPERATOR_EXPRESSION=33; COMPACT_CLAUSE_EXPRESSION=34; SPACE_CLAUSE_EXPRESSION=35

exports.constant = {NUMBER, STRING, IDENTIFIER, SYMBOL, REGEXP, HEAD_SPACES, CONCAT_LINE, PUNCT, FUNCTION,
BRACKET, PAREN, DATA_BRACKET, CURVE, INDENT_EXPRESSION
NEWLINE, SPACES, INLINE_COMMENT, SPACES_INLINE_COMMENT, LINE_COMMENT, BLOCK_COMMENT, CODE_BLOCK_COMMENT, CONCAT_LINE
MODULE_HEADER, MODULE
NON_INTERPOLATE_STRING, INTERPOLATE_STRING
INDENT, UNDENT, HALF_DENT, EOI, C_BLOCK_COMMENT, SPACE_COMMENT, TAIL_COMMENT
#PAREN_OPERATOR_EXPRESSION, COMPACT_CLAUSE_EXPRESSION, SPACE_CLAUSE_EXPRESSION
}