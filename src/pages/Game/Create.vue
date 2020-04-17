<template>
  <div>
    <div class="row justify-center q-ma-lg">
      <div
        class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
        style="max-width:900px; width:100%;font-size:24px"
      >Criar Jogo</div>
    </div>
    <div class="row justify-center q-ma-lg">
      <q-stepper
        style="max-width:900px; width:100%;"
        v-model="step"
        vertical
        active-color="black"
        animated
      >
        <q-step :name="1" title="Adicionar os dados do jogo" icon="settings" :done="step > 1">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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

            <q-stepper-navigation align="right">
              <q-btn type="submit" color="primary" style="color:white!important" label="Salvar"></q-btn>
              <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
            </q-stepper-navigation>
          </q-form>
        </q-step>

        <q-step
          :name="2"
          title="Adicionar algumas imagens"
          caption="Opcional"
          icon="collections"
          :done="step > 2"
        >
          <div
            class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
            style="font-size:21px"
          >Galeria</div>
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
                style="color:white!important"
              ></q-btn>
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn
              flat
              @click="$router.push('/')"
              color="primary"
              label="Voltar a navegar"
              class="q-ml-sm"
            ></q-btn>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
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
  mounted() {},
  data() {
    return {
      step: 1,
      game_id: "",
      game: {
        user_id: this.$auth.user().id,
        name: "",
        rating: 0,
        description: ""
      },
      images: [],
      newImage: null,
      formImage: {
        image: null,
        game_id: null
      }
    };
  },
  methods: {
    onSubmit() {
      this.$auth
        .createGame(this.setGame())
        .then(response => {
          console.log("create game:", response);
          this.step = 2;
          this.game_id = response.data.game.id;
          this.$q.notify({
            message: "Jogo criado!",
            color: "positive"
          });
        })
        .catch(error => {
          console.log("erro create game:", error);
        });
    },
    onReset() {
      this.$router.push("/");
    },
    uploadImage() {
      this.setImage();
      this.$auth
        .uploadGallery(this.formImage)
        .then(response => {
          console.log("uploadGallery", response);
          this.$q.notify({
            message: "Imagem adicionada!",
            color: "positive"
          });
          this.newImage = null;
        })
        .catch(error => {
          console.log("uploadGallery error", error);
        });
    },
    setGame() {
      var data = {
        user_id: this.game.user_id,
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
      this.formImage.set("game_id", this.game_id);
    }
  }
};
</script>