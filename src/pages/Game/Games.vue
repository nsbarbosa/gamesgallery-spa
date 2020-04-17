<template>
  <div>
    <div class="row justify-center q-ma-lg">
      <div
        class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
        style="max-width:900px; width:100%;font-size:24px"
      >Meus Jogos</div>
    </div>
    <div class="row justify-center q-ma-md">
      <q-list style="max-width:900px; width:100%">
        <div v-for="game in games" :key="game.id">
          <q-item class="q-pa-md">
            <q-item-section style="font-size:18px">{{game.name}}</q-item-section>
            <q-item-section top side>
              <div class="q-gutter-md">
                <q-btn
                  @click="dialogDeleteGame(game.id)"
                  color="red-4"
                  size="16px"
                  flat
                  dense
                  round
                  icon="delete_outline"
                ></q-btn>
                <q-btn
                  color="green"
                  size="16px"
                  flat
                  dense
                  round
                  icon="create"
                  @click="$router.push(`/games/edit/${game.id}`)"
                ></q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-separator color="primary" inset></q-separator>
        </div>
      </q-list>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="$router.push('/games/create')"></q-btn>
    </q-page-sticky>
  </div>
</template>

<style>
</style>
<script>
export default {
  name: "user-edit",
  mounted() {
    this.id = this.$auth.user().id;
    this.fetch();
    console.log("id", this.id);
  },
  data() {
    return {
      id: "",
      games: [],
      tab: [],
      slide: 0
    };
  },
  methods: {
    fetch() {
      this.$auth
        .fetchGamesByUser(this.id)
        .then(response => {
          console.log("fetchGamesByUser", response);
          this.games = response.data.games.games;
        })
        .catch(error => {
          console.log("fetchGamesByUser Error", error);
        });
    },
    dialogDeleteGame(id) {
      this.$q
        .dialog({
          title: "Isto irá excluir permanentemente seu jogo",
          message: "Tem certeza disso?",
          ok: "Excluir",
          cancel: "Cancelar"
        })
        .onOk(() => {
          this.$auth.deleteGame(id).then(() => {
            this.fetch();
            this.$q.notify({
              message: "Jogo excluído!",
              color: "positive"
            });
          });
        })
        .onCancel(() => {
          this.fetch();
        });
    }
  }
};
</script>