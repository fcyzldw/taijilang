# The current taiji version number.
exports.VERSION = '0.1.0'

{extend, begin, formatTaijiJson, addPrelude} = require './utils'
TaijiModule = require './module'
{Parser} = require './parser'
{entity} = require './parser/base'
exports.Parser = Parser
{Environment, metaConvert, transformExp, optimizeExp, compileExp, metaCompile, compileExpNoOptimize} = require './compiler'
exports.Environment = Environment
exports.compileExp = compileExp
exports.builtins =  extend {}, require('./builtins/core'), require('./builtins/js')

exports.textizerOptions = textizerOptions = {
  indentWidth: 2, lineLength: 80
}

exports.rootModule = rootModule = new TaijiModule(__filename, null)

exports.initEnv = initEnv = (builtins, taijiModule, options) ->
  options = extend options, textizerOptions
  # Environment(scope=builtins, parent=null, new Parser, taijiModule, newVarIndexMap={}, options)
  env = new Environment(extend({}, builtins), null, new Parser, taijiModule, {}, options)
  env.parser = new Parser
  env

exports.parse = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  formatTaijiJson(entity(exp.body), 0, 0, false, 2, 70)

exports.convert = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  exp = metaConvert(addPrelude(parser, exp.body), env)
  formatTaijiJson(entity(exp), 0, 0, false, 2, 70)

exports.transform = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  exp = transformExp(addPrelude(parser, exp.body), env)
  formatTaijiJson(entity(exp), 0, 0, false, 2, 70)

exports.optimize = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  exp = optimizeExp(addPrelude(parser, exp.body), env)
  formatTaijiJson(entity(exp), 0, 0, false, 2, 70)

exports.compileInteractive = compileInteractive = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.moduleBody, 0, env)
  objCode = compileExp(exp, env)

exports.metaCompile = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  objCode = metaCompile(addPrelude(parser, exp.body), [], env)

exports.compile = compile = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  objCode = compileExp(addPrelude(parser, exp.body), env)

exports.compileNoOptimize  = (code, taijiModule, builtins, options) ->
  env = initEnv(builtins, taijiModule, options); parser = env.parser
  exp = parser.parse(code, parser.module, 0, env)
  objCode = compileExpNoOptimize(addPrelude(parser, exp.body), env)

exports.eval = (code, taijiModule, builtins, options) ->
  x = compile(code, taijiModule, builtins, options)
  eval x

exports.FILE_EXTENSIONS = ['.taiji', '.tj']

exports.register = -> require './register'

# Throw error with deprecation warning when depending upon implicit `require.extensions` registration
if require.extensions
  for ext in exports.FILE_EXTENSIONS
    require.extensions[ext] ?= ->
      throw new Error """
      Use taiji.register() or require the taiji/register module to require #{ext} files.
      """