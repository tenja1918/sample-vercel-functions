import { VercelRequest, VercelResponse } from '@vercel/node';
import axiosBase from 'axios';

const NewsAPIConfig = {
  BASEURL: 'https://newsapi.org/v2',
  ENDPOINT_EVERYTHING: 'everything',
  ENDPOINT_HEADLINES: 'top-headlines',
  APIKEY: '83a312d6d580474aaac8f149a2f7d388',
} as const;
type NewsAPIConfig = typeof NewsAPIConfig[keyof typeof NewsAPIConfig];

interface HeadlinesQueryOptions {
  country?: string;
  category?: string;
  q?: string;
  pageSize?: string;
};

export default function (vreq: VercelRequest, vres: VercelResponse) {
    const endpoint = getFirstQuery(vreq.query.endpoint, '');

    if (endpoint === 'headlines') {
      headlines(vreq, vres);
    // TODO: implementation
    // } else if (endpoint === 'everything') {
    //   everything(vreq, vres);
    } else {
      vres.json({'message' : 'unknown'});
    }
}

function everything(vreq: VercelRequest, vres: VercelResponse) {
}

function headlines(vreq: VercelRequest, vres: VercelResponse) {
  const options: HeadlinesQueryOptions = {
    country: getFirstQuery(vreq.query.country, undefined),
    category: getFirstQuery(vreq.query.category, undefined),
    q: getFirstQuery(vreq.query.q, undefined),
    pageSize: getFirstQuery(vreq.query.pageSize, undefined),
  };

  fetchNews(options).then(async res => {
    vres.json(await res.data);
  }).catch(err => {
    // vres.send('api error: ' + err);
    vres.json({'message' : 'unknown'});
  });
}

async function fetchNews(options: HeadlinesQueryOptions) {
  const query = createQuery(options);

  const axios = axiosBase.create({
    baseURL: NewsAPIConfig.BASEURL,
    headers: {
      Authorization: NewsAPIConfig.APIKEY,
    }
  });

  const path = '/' + NewsAPIConfig.ENDPOINT_HEADLINES + '?' + query;
  console.log(`uri:${NewsAPIConfig.BASEURL}${path}`);

  return await axios.get(path);
}

function getFirstQuery<T>(query: string | string[], defaultValue: T): string | T {
  return [query].flat()[0] ?? defaultValue;
}

function createQuery(options: HeadlinesQueryOptions) {
  const getValue = (name: string, q: string | undefined) => (q != null && q.trim() !== '') ? `${name}=${q}`: undefined;
  const query = [
    getValue('country', options.country),
    getValue('category', options.category),
    getValue('q', options.q),
    getValue('pageSize', options.pageSize),
  ].filter(e => e != null).join('&');

  // 最大文字数でクエリ文字列を切り取る
  return query.substring(0, 1024);
}
