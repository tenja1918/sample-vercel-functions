import { VercelRequest, VercelResponse } from "@vercel/node";

const NewsAPIConfig = {
  BASEURL: 'https://newsapi.org/v2',
  ENDPOINT_EVERYTHING: 'everything',
  ENDPOINT_HEADLINES: 'top-headlines',
  APIKEY: '83a312d6d580474aaac8f149a2f7d388',
} as const;
type NewsAPIConfig = typeof NewsAPIConfig[keyof typeof NewsAPIConfig];

export default function (vreq: VercelRequest, vres: VercelResponse) {
  const query = [vreq.query.keyword].flat().at(0) ?? '';
  fetchNews(query).then(async res => {
    vres.json(await res.json());
  }).catch(err => {
    vres.send('api error');
  });
}

async function fetchNews(_keyword: string) {
  const keyword = _keyword.substring(0, 1024);
  const query = `country=ja&q=${keyword}`;
  const url = NewsAPIConfig.BASEURL + '/' + NewsAPIConfig.ENDPOINT_HEADLINES + '?' + query;
  const req = new Request(url, {
    headers: {
      Authentication: NewsAPIConfig.APIKEY,
    }
  });

  return await fetch(req);
}
