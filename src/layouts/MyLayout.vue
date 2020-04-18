<template>
  <q-layout view="hHh Lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar class="my-color">
        <q-toolbar-title class="q-mt-lg q-ml-lg q-mb-sm">
          <img style="max-height:150px;" :src="header">
        </q-toolbar-title>
        <q-space ></q-space>
        <q-btn-dropdown v-if="!this.$auth.loggedIn()" flat label="Entrar">
          <q-card class=" q-pa-sm">
          <q-card-section>
            <div class="text-h6 text-center">
              Insira seus dados!
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-x-md">
              <div class="col-12">
                <q-input
                  color="primary"
                  outlined
                  bottom-slots
                  v-model.trim="data.body.email"
                  type="email"
                  label="Email"
                  :error="error_email"
                  id="email"
                  :disable="loading"
                />
              </div>
            </div>
            <div class="row q-col-gutter-x-md">
              <div class="col-12">
                <q-input
                  id="password"
                  v-model="data.body.password"
                  label="Senha"
                  outlined
                  :disable="loading"
                  :type="isPwd ? 'password' : 'text'"
                  bottom-slots
                  :error="$v.data.body.password.$error"
                  color="primary"
                >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  ></q-icon>
                </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn
              class="full-width"
              color= "primary"
              label='Entrar'
              :loading="loading"
              @click="login"
            >
            </q-btn>
            <q-btn flat class="full-width q-mt-md" color="primary" label='Cadastrar' to="/register"></q-btn>
          </q-card-actions>
        </q-card>
        </q-btn-dropdown>
        <q-btn v-if="this.$auth.loggedIn()" @click="$router.push('/')" icon="home" flat label="Home"></q-btn>
        <q-btn v-if="this.$auth.loggedIn()" @click="$router.push('/games')" icon="sports_esports" flat label="Meus Jogos"></q-btn>
        <q-btn v-if="this.$auth.loggedIn()" @click="$router.push('/user')" icon="sentiment_very_satisfied" flat label="Perfil"></q-btn>
        <q-btn v-if="this.$auth.loggedIn()" @click="$router.push('/logout')" icon="power_settings_new" flat label="Sair"></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
      <q-ajax-bar
      ref="bar"
      position="bottom"
      color="positive"
      size="15px"
    />
    </q-page-container>
  </q-layout>
</template>

<script>
import { email, required } from 'vuelidate/lib/validators'
import { openURL } from 'quasar'
import { axiosInstance } from 'boot/axios'

export default {
  name: 'MyLayout',
  mounted () {
  },
  data () {
    return {
      error_email: false,
      isPwd: true,
      data: {
        body: {
          email: '',
          password: '',
          rememberMe: false
        }
      },
      loading: false,
      header: 'statics/icons/GG.png',
    }
  },
  methods: {
    openURL,
    login () {
      this.$v.data.$touch()
      this.error_email = this.$v.data.body.email.$error
      if (!this.$v.data.$error) {
        this.loading = true
        this.$auth.login(this.data).then(() => {
          this.$q.notify({
            message: 'Bem Vindo!',
            color: 'positive'
          })
          this.$router.push('/')
        }).catch((error) => {
          console.log(error)
          if (error.data.erros.email) {
            this.$q.notify({
              message: 'Verifique seu email e senha!',
              color: 'negative'
            })
          } else {
            this.$q.notify({
              message: 'Desculpe, ocorreu algum erro!',
              color: 'negative'
            })
          }
        }).finally(() => {
          this.error_email = false
          this.loading = false
        })
      }
    }
  },
  validations: {
    data: {
      body: {
        email: {
          required,
          email
        },
        password: {
          required
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.my-color {
  background-color: #a1c4fd;
}
.my-gradiente {
  background-image: linear-gradient(
    to right,
    #a1c4fd 0%,
    #c2e9fb 51%,
    #a1c4fd 100%
  );
}
.my-gradiente1 {
  background-image: linear-gradient(
    to right,
    #c2e9fb 0%,
    #ffffff 51%,
    #c2e9fb 100%
  );
}
@font-face{
  font-family permanentMarker
  src url(../css/fonts/permanentMarker.woff)
}
// declare a class which applies it
.header-logo {
  font-family permanentMarker
  font-size: 38px
  color: purple
}
@media (min-width: 1024px) {
  .toggle-menu {
    display: none;
  }
}

aside .q-item:not(.active-menu-item) {
  color: #989898;
}

.active-menu-item
  color #101752

.q-expansion-item .q-list .q-item
  border-radius 0 32px 32px 0
  margin-right 15px
  min-height 35px
</style>
