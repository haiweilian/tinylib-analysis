import { promisify } from '../lib/promisify.js'

function load (src, callback){
  setTimeout(() => {
    callback(null, 'name')
  })
}

const loadPromise = promisify(load)

loadPromise('src').then(res => {
  console.log(res) // name
}).catch(err => {
  console.log(err)
})
