const fs = require('fs-extra')
const path = require('path')
const pwd = process.cwd()

const { src, output, include, exclude } = require(path.join(pwd, '.fontprunerc.js'))

const { uniq } = require('lodash');
const { composeP, curry, split } = require('ramda')
const glob = require('glob')
const { promisify } = require('bluebird')
const globPromise = promisify(glob)

const getSpecifiedChar = async (path, encoding = 'utf8') => {
  const reg = /[\u4E00-\u9FA5]/g
  let txt = ''
  const readerStream = fs.createReadStream(path, { encoding })
  readerStream.on('data', chunk => txt += uniq(chunk.match(reg)).join(''))
  // 查找一下怎么抛出错误
  readerStream.on('error', err => { throw err })
  const streamOnPromise = promisify(readerStream.on, { context: readerStream })
  await streamOnPromise('end')
  return uniq(txt).join('')
  // const content = await fs.readFile(path, encoding)
  // return uniq(content.match(reg)).join('')
}


const getPaths = ele => globPromise(ele)
const filterRuledOut = async (regexps, paths) => paths.filter(path => !regexps.some(ele => path.match(ele)))
const curriedFilterRuledOut = curry(filterRuledOut)(exclude)
const spliceChar = async (acc, ele) => `${await acc}${await getSpecifiedChar(ele)}`
const getCharacters = async ele => await ele.reduce(spliceChar, '')
const fUniq = async ele => uniq(ele)
const fJoin = async ele => ele.join('');


(async () => {
  const getC = composeP(
    fJoin,
    fUniq,
    // fSplit,
    getCharacters,
    curriedFilterRuledOut,
    getPaths
  )
  console.log(await getC(include))
})();