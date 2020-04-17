<template>
  <div>
    <div class="row justify-center q-ma-lg">
      <div
        class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
        style="max-width:900px; width:100%;font-size:24px"
      >Editar Jogo</div>
    </div>
    <div class="row justify-center q-ma-lg">
      <q-form
        style="max-width:900px; width:100%"
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          color="primary"
          label="Nome"
          outlined
          v-model="game.name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Digite o nome do jogo']"
        ></q-input>
        <q-input
          color="primary"
          label="Descrição"
          outlined
          v-model="game.description"
          autogrow
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Digite uma descrição para o jogo']"
        ></q-input>
        <div class="q-pl-sm q-pb-md">
          Nota:
          <q-rating size="24px" v-model="game.rating" :max="5"></q-rating>
        </div>
        <div align="right">
          <q-btn label="Salvar" type="submit" color="primary"></q-btn>
          <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
        </div>
      </q-form>
    </div>
    <div class="row justify-center q-ma-lg">
      <div
        class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
        style="max-width:900px; width:100%;font-size:24px"
      >Galeria</div>
    </div>
    <div class="row justify-center q-ma-lg">
      <q-file
        ref="myfile"
        name="myfile"
        style="max-width:200px;"
        clearable
        color="primary"
        filled
        v-model="newImage"
        label="Adicionar Imagem"
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload"></q-icon>
        </template>
      </q-file>
      <div class="row items-center">
        <q-btn
          v-if="newImage !== null"
          @click="uploadImage()"
          class="q-ml-md"
          label="Salvar"
          color="primary"
        ></q-btn>
      </div>
    </div>
    <div class="row justify-center q-ma-lg">
      <div class="row justify-center" style="width:100%;max-width:900px;">
        <q-card
          class="q-ma-md"
          style="width:100%;max-width:350px"
          v-for="image in images"
          :key="image.id"
        >
          <q-card-section horizontal class="q-ma-xs">
            <q-img style="max-height:200px;max-width:300px" :src="image.name"></q-img>

            <q-card-actions vertical class="justify-around q-px-md">
              <q-btn @click="deleteImage(image.id)" color="red" icon="delete"></q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-bg {
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
  mounted() {
    this.id = this.$route.params.id;
    this.fetch();
  },
  data() {
    return {
      id: "",
      game: {
        name: "",
        rating: 0,
        description: ""
      },
      images: [],
      slide: 0,
      newImage: null,
      formImage: {
        image: null,
        game_id: null
      }
    };
  },
  methods: {
    fetch() {
      this.$auth
        .fetchGame(this.id)
        .then(response => {
          console.log(response);
          var game = response.data.game;
          this.game.name = game.name;
          this.game.rating = game.rating;
          this.game.description = game.description;
          this.images = game.images;
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSubmit() {
      console.log(this.id);
      this.$auth
        .updateGame(this.setGame())
        .then(response => {
          console.log("update game:", response);
          this.$q.notify({
            message: "Jogo editado!",
            color: "positive"
          });
        })
        .catch(error => {
          console.log("erro update game:", error);
        });
    },
    onReset() {
      this.$router.push("/games");
    },
    uploadImage() {
      this.setImage();
      this.$auth
        .uploadGallery(this.formImage)
        .then(response => {
          console.log("uploadGallery", response);
          this.fetch();
          this.$q.notify({
            message: "Imagem adicionada!",
            color: "positive"
          });
        })
        .catch(error => {
          console.log("uploadGallery error", error);
        });
    },
    setGame() {
      var data = {
        id: this.id,
        name: this.game.name,
        rating: this.game.rating,
        description: this.game.description
      };
      return data;
    },
    setImage() {
      console.log(this.$refs.myfile.$refs.input.files[0]);
      this.formImage = new FormData();
      this.formImage.set("image", this.$refs.myfile.$refs.input.files[0]);
      this.formImage.set("game_id", this.$route.params.id);
    },
    deleteImage(id) {
      this.$auth
        .deleteImageGallery(id)
        .then(response => {
          console.log(response);
          this.fetch();
          this.$q.notify({
            message: "Imagem removida!",
            color: "positive"
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>