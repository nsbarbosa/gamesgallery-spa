<template>
  <q-page padding class="flex-center">
    <div class="row justify-center q-ma-lg">
      <div
        class="my-gradiente text-center q-pa-sm q-mt-lg shadow-1"
        style="max-width:800px; width:100%;font-size:24px"
      >Editar Dados</div>
    </div>
    <div class="row justify-center q-ma-lg">
      <q-card style="width:100%;max-width:800px">
        <q-card-section>
          <div class="row q-col-gutter-x-md">
            <div class="col-xs-12 col-sm-8">
              <div class="text-subtitle2">Nome:</div>
              <q-input
                dense
                outlined
                type="text"
                v-model.trim="form.name"
                autofocus
                bottom-slots
                :disable="disable"
              />
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-xs-12 col-sm-8">
              <div class="text-subtitle2">Email:</div>
              <q-input
                dense
                outlined
                type="email"
                v-model.trim="form.email"
                bottom-slots
                :error="$v.form.email.$error"
                error-message="Por favor, verifique o email inserido!"
                :disable="disable"
              />
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-xs-12 col-sm-6">
              <div class="text-subtitle2">Senha:</div>
              <q-input dense outlined type="password" v-model="form.password" bottom-slots />
            </div>
            <div class="col-xs-12 col-sm-6">
              <div class="text-subtitle2">Confirme a senha:</div>
              <q-input
                dense
                outlined
                v-model="form.password_confirmation"
                type="password"
                bottom-slots
                :error="$v.form.password_confirmation.$error"
                error-message="As senhas não coincidem!"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="defaultVariables()"></q-btn>
          <q-btn color="primary" label="Editar" :loading="loading" @click="submit()"></q-btn>
        </q-card-actions>
      </q-card>
    </div>

    <div class="row justify-center q-ma-lg">
      <q-card style="width:100%;max-width:800px">
        <q-card-section class="text-h6" align="center">Minha Foto</q-card-section>
        <q-card-section align="center">
          <q-img
            v-if="form.image && file === null"
            :src="form.image"
            :ratio="1"
            style="width: 150px"
          />
          <template v-if="file !== null">
            <q-img
              v-if="file !== null"
              :src="tempImage"
              :ratio="1"
              class="q-ma-md"
              style="width: 150px"
              placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
            />
            <q-btn
              class="image-actions q-ma-sm"
              @click="formImage.image=null; tempImage = null; file = null;"
              color="negative"
              icon="delete"
            >
              <q-tooltip>Remover Imagem</q-tooltip>
            </q-btn>
          </template>
          <q-card-actions v-else align="center" class="q-mt-md">
            <q-btn color="primary" icon="add_box" label="Alterar imagem">
              <input ref="file" type="file" name="file" class="input-file" v-on:change="setImage" />
            </q-btn>
          </q-card-actions>
          <q-card-actions v-if="file !== null" align="right" class="text-primary">
            <q-btn color="primary" label="Editar Imagem" :loading="loading" @click="submitImage()"></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style>
.input-file {
  opacity: 0;
  width: 100%;
  height: 36px;
  position: absolute;
  cursor: pointer;
}
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
import { email, required, sameAs } from "vuelidate/lib/validators";

export default {
  name: "Users",
  mounted() {
    this.fetch();
  },
  data() {
    return {
      disable: false,
      loadingItems: false,
      loading: false,
      file: null,
      tempImage: null,
      formImage: {
        image: null
      },
      data: [],
      form: {
        image: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      newPassword: ""
    };
  },
  methods: {
    fetch() {
      this.$auth
        .fetch()
        .then(response => {
          console.log("fetch user", response);
          let data = response.data.user;
          this.form.name = data.name;
          this.form.email = data.email;
          this.form.password = null;
          this.form.password_confirmation = null;
          this.form.image = data.image;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.loadingItems = false;
        });
    },
    setImage() {
      this.file = this.$refs.file.files[0];
      console.log(this.file);
      this.tempImage = URL.createObjectURL(this.$refs.file.files[0]);
    },
    submitImage() {
      this.formImage = new FormData();
      if (this.file !== null) {
        this.formImage.set("image", this.file);
      }
      this.$auth
        .uploadImage(this.formImage)
        .then(response => {
          this.$q.notify({
            color: "positive",
            message: "Imagem editada!"
          });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: "Desculpe ocorreu um erro ao editar a imagem!"
          });
        });
    },
    submit() {
      this.editUser();
    },
    editUser() {
      this.$v.form.$touch();
      if (!this.$v.form.$error) {
        this.setForm();
        this.$auth
          .editUser(this.data)
          .then(response => {
            this.$q.notify({
              color: "positive",
              message: "Dados editados!"
            });
          })
          .catch(error => {
            console.log(error);
            this.$q.notify({
              color: "negative",
              message: "Desculpe ocorreu um erro ao editar os dados!"
            });
          })
          .finally(() => {
            this.fetch();
            this.defaultVariables();
          });
      }
    },
    setForm() {
      this.data = new FormData();
      this.data.set("_method", "PUT");
      this.data.set("name", this.form.name);
      this.data.set("email", this.form.email);
      if (this.form.password !== null) {
        this.data.set("password", this.form.password);
        this.data.set("password_confirmation", this.form.password_confirmation);
      }
    },
    defaultVariables() {
      this.loading = false;
      this.disable = false;
      for (var key in this.form) {
        this.form[key] = "";
      }
      this.$v.form.$reset();
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password_confirmation: {
        sameAsPassword: sameAs("password")
      }
    }
  }
};
</script>
