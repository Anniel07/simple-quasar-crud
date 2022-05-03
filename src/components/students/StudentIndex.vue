
<template>
  <div class="q-pa-md">
    <!-- row key is iD-->
    <q-table
      title="Manage Students"
      :rows="students"
      :columns="columns"
      row-key="id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
      :loading="loading"
    >
      <!-- template for add, remove buttons at top of the table -->
      <template v-slot:top-right>
        <q-btn
          no-caps
          color="red"
          icon="remove_circle"
          :disable="loading || selected.length === 0"
          label="Delete"
          @click="showConfirmMultiple"
        />

        <!-- this buttons route to router-link to create page -->
        <q-btn
          no-caps
          :to="{ name: 'students.create' }"
          class="q-ml-sm"
          color="green"
          icon="add_circle"
          :disable="loading"
          label="Add new Student"
        />
      </template>

      <!-- for edit and delete in each tr of the table-->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="mode_edit"
            unelevated
            round
            color="yellow"
            flat
            dense
            :to="{ name: 'students.edit', params: { id: props.row.id } }"
          >
            <q-tooltip>
              <span class="text-subtitle2">Edit</span>
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            unelevated
            round
            color="red"
            flat
            dense
            @click="showConfirm(props.row.id)"
          >
            <q-tooltip>
              <span class="text-subtitle2">Delete</span>
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <!-- end editing-delete -->
    </q-table>
    <!-- for test -->
    <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->
  </div>

  <!-- confirm delete dialog -->
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" text-color="negative" />
        <span class="q-ml-sm"
          >Are you sure you want to remove the selection?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          @click="deleteStudent"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script >
import { ref, onMounted } from "vue";

import useStudents from "../../composables/students";
import { useQuasar } from "quasar";
// columns of the table
const columns = [
  {
    name: "firstName",
    required: true,
    label: "First Name",
    align: "left",
    field: (row) => row.firstName,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "lastName",
    align: "left",
    label: "Last Name",
    field: "lastName",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    sortable: true,
    align: "left",
  },
  {
    name: "age",
    label: "Age",
    field: "age",
    align: "left",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "grade",
    label: "Grade",
    field: "grade",
    align: "left",
  },
  { name: "actions", label: "Actions", align: "center", field: "" },
];

export default {
  setup() {
    // use composition api
    const { students, getStudents, destroyStudent } = useStudents();

    const $q = useQuasar();

    const selected = ref([]); // marked in selection
    const loading = ref(false);

    const confirm = ref(false); // if true the  confirm dialog for delete is popUp

    const currentID = ref(-1); //reference to current Id from table to be removed, if == -1 means no selection

    // after the component has mounted into DOM:
    onMounted(() => {
      getStudents();
    });

    function showConfirm(id) {
      confirm.value = true;
      currentID.value = id;
    }

    function showConfirmMultiple() {
      confirm.value = true;
      currentID.value = -1;
    }

    const deleteStudent = async () => {
      loading.value = true;
      //console.log(currentID.value)
      if (currentID.value > 0) {
        const success = await destroyStudent(currentID.value);
        $q.notify({
          color: success ? "positive" : "negative",
          textColor: "white",
          icon: success ? "check_circle" : "cancel",
          message: success
            ? "The record was delete successfully"
            : "Error when deleted this record",
        });
      } else if (selected.value.length > 0) {
        //delete multiple
        let ct = 0;
        let total = selected.value.length;
        for (let std of selected.value) {
          //console.log(std.id)
          
          const success = await destroyStudent(std.id);
          if (success) {
            ct++;
          }
        }
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check_circle",
          message: ct + " of " + total + " records were delete successfully",
        });
        selected.value = []; //clear selection
      }
      await getStudents();
      loading.value = false;
    };

    return {
      selected,
      columns,
      loading,
      confirm,
      students,
      showConfirm,
      showConfirmMultiple,
      deleteStudent,

      getSelectedString() {
        return selected.value.length === 0
          ? ""
          : `${selected.value.length} record${
              selected.value.length > 1 ? "s" : ""
            } selected of ${students.value.length}`;
      },
    };
  },
};
</script>
