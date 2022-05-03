<template>
  <q-page class="column items-center justify-center">
    <q-card class="create-account-card">

      <div v-if="errors.length !== 0">
        <ul>
          <li v-for="(err, index) in errors" :key="index" class="text-negative">
            {{ err }}
          </li>
        </ul>
      </div>

      <q-form @submit="saveStudent">
        <q-card-section>
          <div class="text-h6">Create New Student</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="column q-gutter-md">
          <q-input
            label="First Name *"
            v-model="form.firstName"
            autofocus
            :rules="[
              (val) =>
                (val && val.length > 0) || 'First Name must be filled in.',
            ]"
          ></q-input>
          <q-input
            label="Last Name *"
            v-model="form.lastName"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Last Name must be filled in.',
            ]"
          ></q-input>
          <q-input
            label="Email *"
            v-model="form.email"
            :rules="[(val) => validateEmail(val) || 'Must be a valid email.']"
          ></q-input>
          <q-input
            type="number"
            v-model="form.age"
            label="Your age *"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your age',
              (val) => (val > 0 && val < 90) || 'Please type a real age',
            ]"
          />
          <q-select
            v-model="form.grade"
            :options="gradeOptions"
            label="Your grade *"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please select your grade', // grade is required
            ]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :to="{ name: 'students.index' }">Cancel</q-btn>

          <q-btn color="primary" type="submit">Create</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { reactive } from "vue";
import { useQuasar } from "quasar";
import useStudents from "../../composables/students";

export default {
  setup() {
    const { errors, storeStudent } = useStudents();
    const $q = useQuasar();

    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      grade: "",
    });
    const gradeOptions = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
    //const gradeOptions =  [1, 2, 3, 4, 5, 6];

    const saveStudent = async () => {
      //console.log(form);
      const success = await storeStudent({ ...form });
       $q.notify({
        color: success ? "positive" : "negative",
        textColor: "white",
        icon: success ? "check_circle" : "cancel",
        message: success ? "The record was saved successfully" : "Error when saved this record",
      });
    };

    const validateEmail = (email) => {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
    };

    return {
      form,
      saveStudent,
      errors,
      validateEmail,
      gradeOptions,
    };
  },
};
</script>


<style lang="scss">
.create-account-card {
  width: 512px;
}
</style>


