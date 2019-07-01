const isObject = function (o) {
    return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
};

const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
};

const keysToCamel = function (o) {
    if (isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[toCamel(k)] = keysToCamel(o[k]);
        });

      return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => {
        return keysToCamel(i);
      });
    }

    return o;
};

const validURL = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

module.exports = {keysToCamel, validURL};