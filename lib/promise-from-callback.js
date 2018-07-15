/* @flow */

export default function<Result>(
  callbackFn: ((Error, Result) => void) => void
): Promise<Result> {
  return new Promise((resolve, reject) => {
    callbackFn((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}
