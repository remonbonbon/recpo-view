<script>
  import { onMount } from "svelte";
  import articles from "$lib/data";

  onMount(() => {
    console.log(articles);
  });
</script>

<!------------------------------------>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#">test</a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item"> Home </a>

      <a class="navbar-item"> Documentation </a>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link"> More </a>

        <div class="navbar-dropdown">
          <a class="navbar-item"> About </a>
          <a class="navbar-item is-selected"> Jobs </a>
          <a class="navbar-item"> Contact </a>
          <hr class="navbar-divider" />
          <a class="navbar-item"> Report an issue </a>
        </div>
      </div>
    </div>
  </div>
</nav>
<div class="columns">
  <aside class="column is-2 hero is-fullheight">
    <div>
      <label class="checkbox">
        <input type="checkbox" />
        Remember me
      </label>
    </div>
  </aside>
  <div class="column is-10 hero is-fullheight" id="message-feed">
    <div class="grid _articles-grid">
      {#each articles as article}
        <div class="cell">
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
                    {article.category} | 人数 {article.numOfPlayers} | 時間 {article.howLong}
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
  ._articles-grid {
    --bulma-grid-column-min: 20rem;
  }
  ._article-description {
    max-height: 6em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }
</style>
