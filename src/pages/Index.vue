<template>
  <q-page class="flex-center">
    <div class="q-pt-xl q-mx-md row q-gutter-md justify-center">
      <q-card
        class="my-card shadow-4"
        v-for="(game,index) in games"
        :key="game.id"
        :value="game.id"
      >
        <q-card-section class="q-ma-md">
          <div class="text-h5 q-mb-xs">{{game.name}}</div>
          <div class="q-mt-md row no-wrap items-center">
            <q-rating readonly size="24px" v-model="game.rating" :max="5"></q-rating>
            <span class="text-caption text-grey q-ml-md">Por: {{game.user.name}}</span>
            <q-avatar class="q-ml-sm" size="28px" v-if="game.user.image">
              <img :src="game.user.image" />
            </q-avatar>
          </div>
        </q-card-section>
        <q-tabs v-model="tab[index]" class="text-primary">
          <q-tab
            label="Galeria"
            name="one"
            class="my-gradiente1"
            style="border-right: 2px solid #a1c4fd;"
          ></q-tab>
          <q-tab label="Descrição" name="two" class="my-gradiente1"></q-tab>
        </q-tabs>

        <q-separator></q-separator>

        <q-tab-panels v-model="tab[index]" animated>
          <q-tab-panel name="one">
            <q-card class="my-card">
              <q-carousel
                animated
                v-model="slide[index]"
                arrows
                navigation
                infinite
                control-type="push"
                control-color="black"
              >
                <q-carousel-slide
                  v-for="(image,numb) in game.images"
                  :key="image.id"
                  :name="numb"
                  :img-src="image.name"
                ></q-carousel-slide>
              </q-carousel>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="two">{{game.description}}</q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <q-page-sticky v-if="this.$auth.loggedIn()" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="$router.push('/games/create')"></q-btn>
    </q-page-sticky>
  </q-page>
</template>

<style>
.my-card {
  width: 100%;
  max-width: 400px;
}
.my-button {
  background-image: linear-gradient(
    to right,
    #ebe3f4 0%,
    #f7f4f9 51%,
    #ebe3f4 100%
  );
}
</style>

<script>
export default {
  name: "PageIndex",
  mounted() {
    this.fetch();
  },
  data() {
    return {
      games: [],
      tab: [],
      slide: []
    };
  },
  methods: {
    fetch() {
      this.$auth
        .fetchGames()
        .then(response => {
          console.log(response);
          this.games = response.data.games;
          this.setIndex();
        })
        .catch(error => {
          console.log(error);
        });
    },
    setIndex() {
      for (let i = 0; i < this.games.length; i++) {
        this.slide[i] = 0;
        this.tab[i] = "one";
      }
    }
  }
};
</script>
