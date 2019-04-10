const fs = require('fs-extra')
const path = require('path')
const pwd = process.cwd()

const { src, output, include, exclude } = require(path.join(pwd, '.fontprunerc.js'))

const { composeP, curry, split, uniq } = require('ramda')
const glob = require('glob')
const { promisify } = require('bluebird')
const globPromise = promisify(glob)

const getSpecifiedChar = async (path, code = 'utf-8') => {
  const content = await fs.readFile(path, code)
  return uniq(content.match(/[\u4E00-\u9FA5]/g)).join('')
};


const getPaths = ele => globPromise(ele)
const filterRuledOut = async (regexps, paths) => paths.filter(path => !regexps.some(ele => path.match(ele)))
const curriedFilterRuledOut = curry(filterRuledOut)(exclude)
const spliceChar = async (acc, ele) => `${await acc}${await getSpecifiedChar(ele)}`
const getCharacters = async ele => await ele.reduce(spliceChar, '')
const fUniq = async ele => uniq(ele)
const fJoin = async ele => ele.join('')
const fSplit = async (tag, ele) => {
  console.log(tag, ele)
  return split(tag, ele)
}
const curriedSplit = curry(fSplit)('');


(async () => {
  const getC = composeP(
    fJoin,
    fUniq,
    curriedSplit,
    getCharacters,
    curriedFilterRuledOut,
    getPaths
  )
  console.log(await getC(include))
})();