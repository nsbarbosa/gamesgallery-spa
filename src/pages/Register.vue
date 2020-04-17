<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <q-card style="width: 900px" class="q-pa-lg">
      <q-card-section>
        <div
          class="my-gradiente text-center q-pa-md shadow-1"
          style="font-size:24px"
        >
          <q-icon name="assignment_turned_in" style="font-size: 1.3em;" ></q-icon>
            Cadastre-se
        </div>
      </q-card-section>
      <q-card-section class="q-mx-lg q-mt-md">
        <div class="q-col-gutter-y-md">
          <div class="row q-col-gutter-x-md">
            <div class="col-xs-12 col-sm-6">
              <q-input
                label='Nome'
                v-model.trim="data.name"
                :disable="loading"
                type="text"
                bottom-slots
                :error="$v.data.name.$error"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                bottom-slots
                v-model.trim="data.email"
                type="email"
                label='Email'
                :error="error_email"
                id="email"
                :disable="loading"
              />
            </div>
          </div>
          <div class="row q-col-gutter-x-md">
            <div class="col-xs-12 col-sm-6">
              <q-input
                id="password"
                v-model="data.password"
                label='Senha:'
                :disable="loading"
                :type="isPwd ? 'password' : 'text'"
                bottom-slots
                :error="$v.data.password.$error"
                error-message='Insira uma senha!'
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
            <div class="col-xs-12 col-sm-6">
              <q-input
                id="password_confirmation"
                label='Repita a senha:'
                :disable="loading"
                v-model="data.password_confirmation"
                :type="isPwd2 ? 'password' : 'text'"
                :error="$v.data.password_confirmation.$error"
                error-message='As senhas não coincidem!'
                bottom-slots
              >
              <template v-slot:append>
                <q-icon
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd2 = !isPwd2"
                ></q-icon>
              </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-mr-lg" align="right">
        <q-btn
          class="q-mr-md"
          flat
          color="primary"
          :loading="loading"
          label="Cancelar"
          @click="$router.push('/')"
        />
        <q-btn
          color="primary"
          :loading="loading"
          label="Cadastrar"
          @click="register"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>
.q-field__messages {
    font-size: 14px;
  }
</style>

<script>
import { email, required, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'Register',
  data () {
    return {
      error_email: false,
      isPwd: true,
      isPwd2: true,
      standout_color: 'bg-primary',
      submit: false,
      data: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false
    }
  },
  methods: {
    register () {
      this.$v.data.$touch()
      this.error_email = this.$v.data.email.$error
      console.log('error_email', this.error_email)
      console.log('registrar')
      if (!this.$v.data.$error) {
        console.log('registrar', this.data)
        this.loading = true
        this.$auth.register(this.data).then((response) => {
          this.$q.notify({
            color: 'positive',
            message: 'Cadastro Realizado'
          })
          this.$router.push('/')
        }).catch((error) => {
          console.log('error register()', error)
        }).finally(() => {
          this.loading = false
          this.error_email = false
        })
      }
    }
  },
  validations: {
    data: {
      name: { required },
      email: {
        required,
        email
      },
      password: {
        required
      },
      password_confirmation: {
        sameAsPassword: sameAs('password')
      }
    }
  }
}
</script>
