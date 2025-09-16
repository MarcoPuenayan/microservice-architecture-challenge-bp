import { UrlMatcher, UrlSegment } from '@angular/router';
const pathToRegex = require('path-to-regex');
export function endsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[]) => {
    let parser = new pathToRegex(prefix);
    const fullUrl = url.map((u) => u.path).join('/');

    if (fullUrl.endsWith(prefix)) {
      return { consumed: url };
    }
    const urlToParse = [...url];
    while (urlToParse.length > 0) {
      const fullURLToParse = urlToParse.map((u) => u.path).join('/');
      const match = parser.match(fullURLToParse);
      if (match) {
        let postSegments: any = {};
        Object.keys(match).map((key) => {
          return (postSegments[key] = new UrlSegment(match[key], {}));
        });
        return { consumed: url, posParams: { ...postSegments } };
      }
      urlToParse.shift();
    }
    return null;
  };
}
