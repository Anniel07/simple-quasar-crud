<!-- Create account form just an example for createa form, is not reference in this proyect -->
<template>
  <q-page class="column items-center justify-center">
    <q-card class="create-account-card">
      <q-form @submit="submitForm">
        <q-card-section>
          <div class="text-h6">Create New Account</div>
          <div class="text-subtitle1">
            Fill out the following form to create your new account.
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="column q-gutter-md">
          <q-input
            label="Name *"
            v-model="formState.name"
            :rules="[
              (val) => (val && val.length > 0) || 'Name must be filled in.',
            ]"
          ></q-input>
          <q-input
            label="Email *"
            v-model="formState.email"
            :rules="[(val) => validateEmail(val) || 'Must be a valid email.']"
          ></q-input>
          <q-input
            label="Phone"
            mask="(###) ### - ####"
            fill-mask
            hint="(###) ### - ####"
            v-model="formState.phone"
          ></q-input>
          <q-input
            label="Password *"
            type="password"
            v-model="formState.password.value"
            :rules="[
              (val) => validatePassword(val) || 'Must be a valid password.',
            ]"
          ></q-input>
          <div class="password-criteria q-pa-sm">
            <div class="text-subtitle2 q-mb-sm">Password Criteria:</div>
            <div>
              <q-icon
                :name="validPassword.length ? 'check_circle' : 'cancel'"
                :color="validPassword.length ? 'positive' : 'negative'"
              ></q-icon>
              Must be at least 12 characters long.
            </div>
            <div>
              <q-icon
                :name="validPassword.capital ? 'check_circle' : 'cancel'"
                :color="validPassword.capital ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one capital letter.
            </div>
            <div>
              <q-icon
                :name="validPassword.number ? 'check_circle' : 'cancel'"
                :color="validPassword.number ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one number.
            </div>
            <div>
              <q-icon
                :name="validPassword.symbol ? 'check_circle' : 'cancel'"
                :color="validPassword.symbol ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one symbol.
            </div>
          </div>
          <q-input
            label="Confirm Password *"
            type="password"
            v-model="formState.password.confirm"
            :disable="!validatePassword(formState.password.value)"
            :rules="[
              (val) =>
                (val && val === formState.password.value) ||
                'Must match password.',
            ]"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat>Cancel</q-btn>
          <q-btn color="primary" type="submit">Create Account</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { reactive } from "vue";

export default {
  setup() {


    const formState = reactive({
      name: "",
      email: "",
      phone: "",
      password: {
        value: "",
        confirm: "",
      },
    });

    const validPassword = reactive({
      length: false,
      capital: false,
      number: false,
      symbol: false,
    });

    const submitForm = () => {
      console.log(formState);
    };

    const validateEmail = (email) => {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    };

    /** return a boolean value */
    function validatePassword(password) {
      // Test length
      validPassword.length = formState.password.value.length >= 12;

      // Test capital
      validPassword.capital = /^(?=.*[A-Z]).*$/.test(password);

      // Test number
      validPassword.number = /^(?=.*[0-9]).*$/.test(password);

      // Test symbol
      validPassword.symbol = /^(?=.*[!@#$%^&*-_+=]).*$/.test(password);

      return (
        validPassword.length &&
        validPassword.capital &&
        validPassword.number &&
        validPassword.symbol
      );
    }

    return {
      formState,
      submitForm,
      validateEmail,
      validPassword,
      validatePassword,
    };
  },
};

</script>


<style lang="scss">
.create-account-card {
  width: 512px;
}
.password-criteria {
  background-color: #efefef;
  border-radius: 0.5rem;
}
</style>
