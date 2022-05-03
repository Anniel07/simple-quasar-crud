import { ref } from 'vue'
import { api } from "boot/axios";
import { useRouter } from 'vue-router'

export default function useStudents() {
    const student = ref([])
    const students = ref([])

    const errors = ref([]) //array of strings
    const router = useRouter()

    const getStudents = async () => {
        try {
            const response = await api.get('/api/students')
            console.log(response.data)

            students.value = response.data
        } catch (error) {
            console.log(error.message);
        }
    }

    const getStudent = async (id) => {
        const response = await api.get(`/api/students/${id}`)
        student.value = response.data
    }

    const storeStudent = async (data) => {
        errors.value = []
        let successs;
        try {
            await api.post('/api/students', data)
            await router.push({ name: 'students.index' })
            successs = true;
        } catch (e) {
            successs = false;
            if (e.response.status === 400) { //Bad request, for validation in .net core

                for (const key in e.response.data.errors) {
                    errors.value.push(e.response.data.errors[key][0]) ;
                }
            }
        }
        return successs;
    }

    const updateStudent = async (id) => {
        errors.value = [];
        let successs;
        try {
            // api method must be put for match put method in .net core api
            await api.put(`/api/students/${id}`, student.value)
            await router.push({ name: 'students.index' })
            successs = true;
        } catch (e) {
          successs = false;
            if (e.response.status === 400) { //Bad request, for validation

                for (const key in e.response.data.errors) {
                    errors.value.push( e.response.data.errors[key][0]);
                }
            }
        }
        return successs;
    }

    const destroyStudent = async (id) => {
      try{
        await api.delete(`/api/students/${id}`)
        return true
      }catch(e){
        return false
      }
    }

    return {
        errors,
        student,
        students,
        getStudents,
        getStudent,
        storeStudent,
        updateStudent,
        destroyStudent
    }
}
