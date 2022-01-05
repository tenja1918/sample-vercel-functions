<!-- ----------------------------------------------- -->
<!-- template -->
<!-- ----------------------------------------------- -->
<template>
  <div>
    <h2>Get News</h2>

    <input v-model="data.q" maxlength="256" placeholder="検索したい内容..." />
    <input class="btn btn-primary" type="button" value="ニュースを検索" @click="fetchNews" />

    <hr />

    <div id="newsList" v-if="data.articles.length > 0">
      <div id="article" v-for="article in data.articles" :key="article.title">
        <a :href="article.url" target="_blank">
          <!-- 画像の有無に応じてNoImageを出し分け -->
          <img v-if="article.urlToImage" :src="article.urlToImage" />
          <img v-else src="../assets/images/no_image_logo.png" />
          <p>{{ article.title }}</p>
        </a>
      </div>
    </div>

    <div id="notfound" v-if="data.articles.length === 0">記事はありません。</div>
  </div>
</template>

<!-- ----------------------------------------------- -->
<!-- style -->
<!-- ----------------------------------------------- -->
<style scoped>
#newsList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#newsList img {
  width: 200px;
  height: 150px;
}
</style>

<!-- ----------------------------------------------- -->
<!-- script -->
<!-- ----------------------------------------------- -->
<script lang="ts">
import { defineComponent, reactive } from 'vue';

interface Article {
  url?: string;
  title: string;
  urlToImage?: string;
}

export default defineComponent({
  emits: ['update:articles'],

  setup() {
    const data = reactive({
      q: '',
      articles: <Article[]>([]),
    });

    const fetchNews = () => {
      // URL初期化
      const url = new URL("https://sample-vercel-functions.vercel.app/api/news/headlines");
      const queries = {
        q: data.q,
      };
      url.search = new URLSearchParams(queries).toString();

      // fetch
      console.log(`url: ${url.toString()}`);
      fetch(url.toString()).then(res => {
        // this.status = res.status;
        return res.json();
      }).then(json => {
        data.articles = (json['totalResults'] >= 0) ? json['articles'] : [];
      });
    }

    return {
      fetchNews,
      data,
    }
  }
})
</script>
