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
          <div class="text-h6">Edit Student</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="column q-gutter-md">
          <q-input
            label="First Name *"
            v-model="student.firstName"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'First Name must be filled in.',
            ]"
          ></q-input>
          <q-input
            label="Last Name *"
            v-model="student.lastName"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Last Name must be filled in.',
            ]"
          ></q-input>
          <q-input
            label="Email *"
            v-model="student.email"
            :rules="[(val) => validateEmail(val) || 'Must be a valid email.']"
          ></q-input>
          <q-input
            type="number"
            v-model="student.age"
            label="Your age *"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please type your age',
              (val) => (val > 0 && val < 90) || 'Please type a real age',
            ]"
          />

          <q-select
            v-model="student.grade"
            :options="gradeOptions"
            label="Your grade *"
            :rules="[
              (val) => (val !== null && val !== '') || 'Please select your grade', // grade is required
            ]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :to="{ name: 'students.index' }">Cancel</q-btn>
          <q-btn color="primary" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted } from "vue";
import useStudents from "../../composables/students";
import { useQuasar } from "quasar";

export default {
  // required by getByID
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const { errors, student, getStudent, updateStudent } = useStudents();
    const $q = useQuasar();
    //const gradeOptions = [1, 2, 3, 4, 5, 6];
    const gradeOptions =  ["1st", "2nd", "3rd", "4th", "5th", "6th"];

    onMounted(() => getStudent(props.id));

    const saveStudent = async () => {

     const success = await updateStudent(props.id);
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
      student,
      saveStudent,
      validateEmail,
      errors,
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




