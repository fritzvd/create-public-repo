function replacer(strings) {
  return function(...data) {
      return strings
        .slice()
        .map((string, i) => {
          if (data.length > 0 && data[i - 1]) {
            return `${string.trim()} ${data[i - 1]}`
          } else {
            return string.trim()
          }
        })
        .join('')
  }
}
const r = replacer;

module.exports = {
  copyingTo: r`Copying files to ${'destination'}`,
  noDestination: r`Add a destination with \`npm start -- -d path/to/destination\` or create-course-repo -d ../path/`
}