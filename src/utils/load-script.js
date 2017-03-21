export function loadJs (src) {
  if (!src) {
    throw Error('invalid javascript file path!');
  }
  let script = document.createElement('script');
  let xNode = document.getElementsByTagName('script')[0];
  script.type = 'text/javascript';
  script.async = true;
  script.src = src;
  xNode.parentNode.insertBefore(script, xNode);
  return new Promise((resolve, reject) => {
    script.addEventListener('load', () => {
      resolve();
    })
    script.addEventListener('error', () => {
      reject();
    })
  })
}
