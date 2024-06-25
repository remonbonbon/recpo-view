<script>
  import { default as GLOBAL_ARTICLES } from "$lib/data";
  import _ from "lodash-es";

  let categories = _.uniq(GLOBAL_ARTICLES.map((a) => a.category));
  let playersList = _.uniq(GLOBAL_ARTICLES.map((a) => a.numOfPlayers));
  playersList = _.sortBy(playersList, (p) => parseInt(p, 10) || 0);
  let howLongList = _.uniq(GLOBAL_ARTICLES.map((a) => a.howLong));
  let selectedCategories = [];
  let selectedPlayers = [];
  let selectedHowLong = [];
  let sortOption = "latest";
  let searchWord = "";

  let articles = [];
  $: {
    let tmp = GLOBAL_ARTICLES;
    if (searchWord) {
      tmp = tmp.filter(
        (a) =>
          a.title?.includes(searchWord) ||
          a.description?.includes(searchWord) ||
          a.detail?.includes(searchWord),
      );
    }
    if (0 < selectedCategories.length) {
      tmp = tmp.filter((a) => selectedCategories.includes(a.category));
    }
    if (0 < selectedPlayers.length) {
      tmp = tmp.filter((a) => selectedPlayers.includes(a.numOfPlayers));
    }
    if (0 < selectedHowLong.length) {
      tmp = tmp.filter((a) => selectedHowLong.includes(a.howLong));
    }
    if (sortOption === "latest") {
      tmp = _.orderBy(tmp, "publishedAt", "desc");
    }
    if (sortOption === "random") {
      tmp = _.shuffle(tmp);
    }
    articles = tmp; // fire trigger
  }
</script>

<!------------------------------------>

<!-- ナビバー -->
<nav class="navbar" aria-label="main navigation">
  <div class="navbar-brand">
    <span class="navbar-item">TEST</span>
  </div>

  <div class="navbar-item">
    <div class="field has-addons">
      <div class="control" style="width:30rem">
        <input
          class="input is-rounded"
          type="text"
          placeholder="検索"
          bind:value={searchWord}
        />
      </div>
      <div class="control">
        <button class="button is-dark is-rounded">
          <span class="icon is-large" style="margin:0 .5rem">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</nav>
<div class="columns">
  <!-- サイドバー -->
  <aside class="column is-2 is-fullheight _search-controlls">
    <div class="container">
      <div class="field">
        <label class="label">カテゴリー</label>
        {#each categories as cat}
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                value={cat}
                bind:group={selectedCategories}
              />{cat}</label
            >
          </div>
        {/each}
      </div>
      <div class="field">
        <label class="label">参加人数</label>
        {#each playersList as players}
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                value={players}
                bind:group={selectedPlayers}
              />{players}</label
            >
          </div>
        {/each}
      </div>
      <div class="field">
        <label class="label">所要時間</label>
        {#each howLongList as howLong}
          <div class="control">
            <label class="checkbox">
              <input
                type="checkbox"
                value={howLong}
                bind:group={selectedHowLong}
              />{howLong}</label
            >
          </div>
        {/each}
      </div>
    </div>
  </aside>
  <div class="column is-10 is-fullheight">
    <!-- 件数とか -->
    <div class="block">
      <div class="is-flex is-flex-direction-row">
        <div class="control has-icons-left">
          <div class="select is-rounded">
            <select bind:value={sortOption}>
              <option value="latest">最新</option>
              <option value="random">ランダム</option>
            </select>
          </div>
          <div class="icon is-small is-left">
            <i class="fa-solid fa-arrow-down-wide-short"></i>
          </div>
        </div>
        <div class="ml-3 mt-1">
          <span class="is-size-5">
            {#if searchWord}「{searchWord}」の検索結果{:else}全{/if}
            {articles.length} 件
          </span>
        </div>
      </div>
    </div>
    <!-- 一覧 -->
    <div class="grid _articles-grid">
      {#each articles as article}
        <div class="cell _articles-cell">
          <div class="card">
            <div class="card-image">
              <figure class="image is-16by9">
                <a
                  href={`https://www.youtube.com/watch?v=${article.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  ><img
                    src={`https://img.youtube.com/vi/${article.youtubeId}/mqdefault.jpg`}
                    alt="Youtube"
                  /></a
                >
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <h4 class="title is-4">{article.title}</h4>
                  <h6 class="subtitle is-6">
                    {article.publishedAt}<br />{article.category} | 人数 {article.numOfPlayers}
                    | 時間 {article.howLong}
                  </h6>
                </div>
              </div>
              <div class="content _article-description">
                {article.description}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!------------------------------------>
<style>
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  ._search-controlls {
    margin-left: 0.5rem;
  }
  ._search-controlls .control {
    margin-left: 0.5rem;
  }
  ._articles-grid {
    --bulma-grid-column-min: 20rem;
  }
  ._articles-cell {
    max-width: 30rem;
  }
  ._article-description {
    max-height: 6em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }
</style>
