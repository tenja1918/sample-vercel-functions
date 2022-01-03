import { VercelRequest, VercelResponse } from '@vercel/node';
import axiosBase from 'axios';

const NewsAPIConfig = {
  BASEURL: 'https://newsapi.org/v2',
  ENDPOINT_EVERYTHING: 'everything',
  ENDPOINT_HEADLINES: 'top-headlines',
  APIKEY: '83a312d6d580474aaac8f149a2f7d388',
} as const;
type NewsAPIConfig = typeof NewsAPIConfig[keyof typeof NewsAPIConfig];

export default function (vreq: VercelRequest, vres: VercelResponse) {
  // const query = [vreq.query.keyword].flat().at(0) ?? '';
  const query = [vreq.query.keyword].flat()[0] ?? '';
  fetchNews(query).then(async res => {
    vres.json(await res.data);
  }).catch(err => {
    vres.send('api error: ' + err);
  });
}

async function fetchNews(_keyword: string) {
  const keyword = _keyword.substring(0, 1024);
  const query = `q=${keyword}`;

  const axios = axiosBase.create({
    baseURL: NewsAPIConfig.BASEURL,
    headers: {
      Authorization: NewsAPIConfig.APIKEY,
    }
  });
  const path = '/' + NewsAPIConfig.ENDPOINT_HEADLINES + '?' + query;
  console.log('path = ' + path);
  return await axios.get(path);
}

function createQuery() {

}
